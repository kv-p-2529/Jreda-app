import RazorpayCheckout, {
  RazorpayErrorResponse,
  RazorpayOptions,
  RazorpaySuccessResponse,
} from 'react-native-razorpay';

import apiClient from '@/api/apiClient';
import {
  RAZORPAY_BUSINESS_NAME,
  RAZORPAY_CURRENCY,
  RAZORPAY_DESCRIPTION,
  RAZORPAY_KEY_ID,
  RAZORPAY_THEME_COLOR,
  RAZORPAY_USE_SERVER_ORDER,
} from '@/config/razorpay';

// Payment service for the registration flow. Three responsibilities:
//   1. Talk to OUR server to create an Order and to verify the signature
//      (the parts that need the secret key — they must run server-side).
//   2. Open the native Razorpay checkout sheet.
//   3. Stitch those together into `payRegistrationFee()`, a single call the UI
//      can await and switch on.
//
// Money is handled in *paise* everywhere below the UI boundary, because that's
// what Razorpay expects (`amount` is the smallest currency subunit). Rupee
// values only exist for display.

// ---------------------------------------------------------------------------
// Fees
// ---------------------------------------------------------------------------

export interface RegistrationFee {
  /** Base registration fee, in rupees. */
  registrationFee: number;
  /** Convenience fee, in rupees. */
  convenienceFee: number;
  /** GST applied on (registrationFee + convenienceFee), as a percentage. */
  gstPercent: number;
}

/**
 * Total payable in paise (integer), matching the figure shown on the Payment
 * screen. Rounded at the end so float drift (e.g. 613.5999…) can't sneak a
 * fractional paisa into the amount we send to Razorpay.
 */
export function computeTotalPaise(fee: RegistrationFee): number {
  const base = fee.registrationFee + fee.convenienceFee;
  const withGst = base * (1 + fee.gstPercent / 100);
  return Math.round(withGst * 100);
}

// ---------------------------------------------------------------------------
// Server contract (create order / verify signature)
// ---------------------------------------------------------------------------

interface CreateOrderRequest {
  /** Amount in paise. */
  amount: number;
  currency: string;
  /** Our reference for the order; surfaces in the Dashboard. */
  receipt: string;
  notes?: Record<string, string>;
}

interface CreateOrderResponse {
  /** Razorpay order id (order_…). */
  orderId: string;
  /** Echo of the amount in paise the server actually created the order for. */
  amount: number;
  currency: string;
  /**
   * Key ID to use for this checkout. Lets the server hand the client the right
   * (test/live) public key instead of hardcoding it. Falls back to the bundled
   * key when absent.
   */
  keyId?: string;
}

interface VerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Ask our server to create a Razorpay Order. The server holds the key secret
 * and calls Razorpay's Orders API. Adjust the path/response mapping to match
 * the real backend once it lands.
 */
export async function createPaymentOrder(
  body: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const { data } = await apiClient.post<CreateOrderResponse>(
    '/payments/order',
    body,
  );
  return data;
}

/**
 * Ask our server to verify the signature returned by checkout. The server
 * recomputes `hmac_sha256(order_id|payment_id, secret)` and compares. Returns
 * `true` only when the payment is authentic.
 */
export async function verifyPayment(body: VerifyRequest): Promise<boolean> {
  const { data } = await apiClient.post<{ valid: boolean }>(
    '/payments/verify',
    body,
  );
  return data.valid === true;
}

// ---------------------------------------------------------------------------
// Checkout orchestration
// ---------------------------------------------------------------------------

export interface PaymentPrefill {
  name?: string;
  email?: string;
  /** Mobile number; we normalise to +91 form before handing it to checkout. */
  contact?: string;
}

export type PaymentResult =
  | {
      status: 'success';
      paymentId: string;
      orderId?: string;
      signature?: string;
    }
  | { status: 'cancelled' }
  | { status: 'failed'; reason: string };

/** Razorpay wants `+{country code}{number}`; default a bare 10-digit to +91. */
function normaliseContact(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.replace(/\s+/g, '');
  if (!trimmed) return undefined;
  if (trimmed.startsWith('+')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length === 10 ? `+91${digits}` : trimmed;
}

/**
 * The native reject payload is sometimes an object and sometimes a JSON string;
 * occasionally a user-cancel surfaces as a plain message. Normalise it into a
 * code + description so callers don't have to.
 */
function parseRazorpayError(error: unknown): { code?: number; description: string } {
  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error) as Partial<RazorpayErrorResponse>;
      return {
        code: parsed.code,
        description: parsed.description ?? error,
      };
    } catch {
      return { description: error };
    }
  }
  if (error && typeof error === 'object') {
    const e = error as Partial<RazorpayErrorResponse> & {
      // Some SDK versions nest the human message one level deep.
      error?: { description?: string };
    };
    return {
      code: e.code,
      description:
        e.description ?? e.error?.description ?? 'Payment could not be completed.',
    };
  }
  return { description: 'Payment could not be completed.' };
}

/** Razorpay's "user cancelled / dismissed" maps to code 0 (and code 2 on some builds). */
function isCancellation(code?: number, description?: string): boolean {
  if (code === 0 || code === 2) return true;
  return /cancel|dismiss/i.test(description ?? '');
}

/**
 * Run the full registration-fee payment and report a single, switchable
 * result. Never throws — every failure path resolves to a `failed`/`cancelled`
 * result so the UI can stay declarative.
 *
 * Production path (RAZORPAY_USE_SERVER_ORDER = true):
 *   create order → open checkout with order_id → verify signature → success.
 * Test path (false): open checkout with key + amount only; treat a returned
 *   payment id as success without server verification.
 */
export async function payRegistrationFee(params: {
  fee: RegistrationFee;
  referenceNo: string;
  prefill?: PaymentPrefill;
}): Promise<PaymentResult> {
  const { fee, referenceNo, prefill } = params;
  const amount = computeTotalPaise(fee);
  const notes = { referenceNo };

  // Step 1 — create the order server-side (production path only).
  let order: CreateOrderResponse | null = null;
  if (RAZORPAY_USE_SERVER_ORDER) {
    try {
      order = await createPaymentOrder({
        amount,
        currency: RAZORPAY_CURRENCY,
        receipt: referenceNo,
        notes,
      });
    } catch (e) {
      console.error('Failed to create Razorpay order', e);
      return {
        status: 'failed',
        reason: 'We could not start the payment. Please try again.',
      };
    }
  }

  // Step 2 — open checkout.
  const options: RazorpayOptions = {
    key: order?.keyId ?? RAZORPAY_KEY_ID,
    amount: order?.amount ?? amount,
    currency: order?.currency ?? RAZORPAY_CURRENCY,
    name: RAZORPAY_BUSINESS_NAME,
    description: RAZORPAY_DESCRIPTION,
    theme: { color: RAZORPAY_THEME_COLOR },
    notes,
    prefill: {
      name: prefill?.name,
      email: prefill?.email || undefined,
      contact: normaliseContact(prefill?.contact),
    },
  };
  if (order?.orderId) {
    options.order_id = order.orderId;
  }

  let success: RazorpaySuccessResponse;
  try {
    success = await RazorpayCheckout.open(options);
  } catch (e) {
    const { code, description } = parseRazorpayError(e);
    if (isCancellation(code, description)) {
      return { status: 'cancelled' };
    }
    return { status: 'failed', reason: description };
  }

  // Step 3 — verify the signature server-side (production path only).
  if (RAZORPAY_USE_SERVER_ORDER) {
    if (
      !success.razorpay_order_id ||
      !success.razorpay_signature
    ) {
      return {
        status: 'failed',
        reason: 'Payment response was incomplete. Please contact support.',
      };
    }
    try {
      const valid = await verifyPayment({
        razorpay_order_id: success.razorpay_order_id,
        razorpay_payment_id: success.razorpay_payment_id,
        razorpay_signature: success.razorpay_signature,
      });
      if (!valid) {
        return {
          status: 'failed',
          reason: 'Payment could not be verified. Please contact support.',
        };
      }
    } catch (e) {
      console.error('Failed to verify Razorpay payment', e);
      return {
        status: 'failed',
        reason: 'Payment verification failed. Please contact support.',
      };
    }
  }

  return {
    status: 'success',
    paymentId: success.razorpay_payment_id,
    orderId: success.razorpay_order_id,
    signature: success.razorpay_signature,
  };
}
