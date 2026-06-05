// Ambient types for `react-native-razorpay` — the package ships no .d.ts of its
// own (its `main` is a plain RazorpayCheckout.js). This mirrors the runtime
// surface we actually use: `RazorpayCheckout.open()` returns a Promise that
// resolves with the success payload and rejects with the native error object.
//
// Keep this in sync with the options we pass in `@/services/payment`. The
// option set is intentionally a subset of Razorpay's full Standard Checkout
// options; the index signature lets callers pass extras without fighting TS.

declare module 'react-native-razorpay' {
  export interface RazorpayPrefill {
    name?: string;
    email?: string;
    /** Phone number, ideally in `+{country code}{number}` form. */
    contact?: string;
    /** Pre-select a method: 'card' | 'netbanking' | 'wallet' | 'upi' | 'emi'. */
    method?: string;
  }

  export interface RazorpayTheme {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  }

  export interface RazorpayOptions {
    /** API Key ID (rzp_test_… / rzp_live_…). */
    key: string;
    /** Amount in the smallest currency subunit (paise for INR). */
    amount: number | string;
    currency?: string;
    name?: string;
    description?: string;
    image?: string;
    /** Order ID from the Orders API. Required to capture the payment. */
    order_id?: string;
    prefill?: RazorpayPrefill;
    notes?: Record<string, string>;
    theme?: RazorpayTheme;
    [key: string]: unknown;
  }

  export interface RazorpaySuccessResponse {
    razorpay_payment_id: string;
    /** Present only when the checkout was opened with an `order_id`. */
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }

  /** Shape of the object passed to the rejection handler on failure/cancel. */
  export interface RazorpayErrorResponse {
    code: number;
    description: string;
    [key: string]: unknown;
  }

  export default class RazorpayCheckout {
    static open(
      options: RazorpayOptions,
      successCallback?: (data: RazorpaySuccessResponse) => void,
      errorCallback?: (data: RazorpayErrorResponse) => void,
    ): Promise<RazorpaySuccessResponse>;

    static onExternalWalletSelection(
      callback: (data: { external_wallet: string }) => void,
    ): void;
  }
}
