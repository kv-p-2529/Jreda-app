import { showToast } from '@/utils/helpers';

// Centralised API-error → toast helper. Pass any caught error (typically an
// Axios error) and it surfaces the most useful human-readable message via the
// app's toast. Backend error shape:
//
//   {
//     "success": false,
//     "message": "Human readable error",
//     "errors": [
//       { "field": "mobile", "message": "Invalid mobile number" }
//     ]
//   }
//
// Priority: first field-level validation message → top-level message → fallback.

type FieldError = { field?: string; message?: string };

function extractMessage(err: any): string {
  const data = err?.response?.data;

  // 1. Field-level validation errors — show the first one (that's the field the
  //    user needs to fix). Handles both the documented array shape and a
  //    legacy { field: [messages] } map.
  const errors = data?.errors ?? err?.response?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    const first = errors.find((e: FieldError) => e?.message) as FieldError | undefined;
    if (first?.message) {
      return first.message;
    }
  } else if (errors && typeof errors === 'object') {
    const firstValue = Object.values(errors)[0];
    const msg = Array.isArray(firstValue) ? firstValue[0] : firstValue;
    if (typeof msg === 'string' && msg) {
      return msg;
    }
  }

  // 2. Top-level human-readable message from the API.
  if (typeof data?.message === 'string' && data.message) {
    return data.message;
  }

  // 3. Network / unexpected errors (no response body).
  if (typeof err?.message === 'string' && err.message) {
    return err.message;
  }

  return 'Something went wrong!';
}

export default function throwError(err: any) {
  if (__DEV__) {
    console.log('throwError:', err?.response?.data ?? err);
  }
  showToast(extractMessage(err));
}
