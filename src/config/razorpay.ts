// Razorpay integration config. Centralised here so the key, brand styling and
// the server-vs-test toggle live in ONE place rather than being sprinkled
// through the payment flow.
//
// SECURITY NOTE (from Razorpay's own docs): the *secret* key must never ship in
// the app — it stays on your server and is only used there to create orders and
// verify signatures. Only the public Key ID (rzp_test_… / rzp_live_…) belongs
// on the client, and even that is ideally fetched from your server at runtime.
// For now it's a constant; swap to a server-provided value when that endpoint
// exists.

/**
 * Public Razorpay Key ID. Replace with your real test key, then the live key at
 * go-live. A `rzp_test_…` key opens the mock checkout where no real money moves.
 */
export const RAZORPAY_KEY_ID = 'rzp_test_nUc7oYd6aIqhzy';

/**
 * Whether to drive the production flow:
 *   1. create an Order on our server (→ `order_id`)
 *   2. open checkout with that `order_id`
 *   3. verify the returned signature on our server
 *
 * Set this to `true` once the `/payments/order` and `/payments/verify`
 * endpoints are live. While `false`, checkout opens in test mode with just
 * key + amount (no `order_id`), so the flow is demoable end-to-end without a
 * backend. Razorpay auto-refunds order-less payments, so this MUST be `true`
 * before accepting real money.
 */
export const RAZORPAY_USE_SERVER_ORDER = false;

/** Brand presentation on the checkout sheet. */
export const RAZORPAY_BUSINESS_NAME = 'PM-KUSUM • JREDA';
export const RAZORPAY_DESCRIPTION = 'PM-KUSUM Registration Fee';
export const RAZORPAY_THEME_COLOR = '#1382F5';

/** All registration fees are collected in INR. */
export const RAZORPAY_CURRENCY = 'INR';
