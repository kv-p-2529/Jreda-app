import { Alert, Platform } from 'react-native';

import { ReceiptData } from './PaymentReceipt';
import { buildReceiptHtml } from './receiptHtml';

// Generates the receipt PDF and hands it to the share sheet (which is also how
// the user saves it to Files/Downloads). The native modules are loaded lazily so
// the JS bundle still runs on a build where they aren't available yet.
//
// IMPORTANT: react-native-html-to-pdf / react-native-share are NATIVE modules.
// Adding them to package.json + `npm install` is NOT enough — the app on the
// device/emulator must be fully rebuilt (Gradle/Xcode), because a Metro reload
// only swaps JS and can't add native code to the already-installed APK/IPA.
//
//   npm install
//   cd ios && pod install            # iOS only
//   npx react-native run-android     # full native rebuild (or run-ios)

type Result = { ok: boolean; filePath?: string; reason?: string };

// Both libraries are TurboModules under the New Architecture: at import time they
// call `TurboModuleRegistry.getEnforcing(...)` ('HtmlToPdf' / 'RNShare'), which
// THROWS when the native side isn't in the running build. So a require() wrapped
// in try/catch is the reliable "is it linked?" probe — there is no legacy
// `NativeModules` entry to null-check (the modules don't register under their JS
// package name). The public API is the named `generatePDF` export, not a
// `.default` object with `.convert`.
function loadModules() {
  let generatePDF: any;
  let Share: any;
  try {
    generatePDF = require('react-native-html-to-pdf').generatePDF;
    Share = require('react-native-share').default;
  } catch (e) {
    return { ok: false as const, error: e };
  }

  if (
    typeof generatePDF !== 'function' ||
    !Share ||
    typeof Share.open !== 'function'
  ) {
    return { ok: false as const, error: null };
  }
  return { ok: true as const, generatePDF, Share };
}

export async function downloadReceiptPdf(data: ReceiptData): Promise<Result> {
  const mods = loadModules();
  if (!mods.ok) {
    if (mods.error) {
      console.error('[receipt] failed to load native modules:', mods.error);
    }
    Alert.alert(
      'Receipt download needs a rebuild',
      'The PDF module isn’t in the currently installed app. Close the app and run a full native rebuild (npx react-native run-android), then try again — a Metro reload alone won’t add it.',
    );
    return { ok: false, reason: 'modules-not-linked' };
  }

  const { generatePDF, Share } = mods;
  const fileName = `PaymentReceipt_${data.applicationNumber || 'JREDA'}`;

  // 1) Generate the PDF. Keep this isolated so a generation failure reports the
  //    real native error instead of being confused with a share-sheet cancel.
  let filePath: string | undefined;
  try {
    const res = await generatePDF({
      html: buildReceiptHtml(data),
      fileName,
      // 'Documents' is the only directory this library officially supports on
      // both platforms; 'Download' fails under Android scoped storage. The file
      // reaches the user's Downloads via the share sheet below.
      directory: 'Documents',
      base64: false,
    });
    filePath = res?.filePath ?? undefined;
  } catch (err) {
    console.error('[receipt] PDF generation failed:', err);
    Alert.alert(
      'Could not generate receipt',
      `PDF generation failed: ${String((err as Error)?.message ?? err)}`,
    );
    return { ok: false, reason: 'generate-failed' };
  }

  if (!filePath) {
    Alert.alert('Could not generate receipt', 'No file was produced.');
    return { ok: false, reason: 'no-file' };
  }

  // 2) Share/save. A user dismissing the sheet throws — that's not an error.
  try {
    const url = Platform.OS === 'android' ? `file://${filePath}` : filePath;
    await Share.open({
      url,
      type: 'application/pdf',
      filename: fileName,
      failOnCancel: false,
    });
  } catch (err) {
    const message = String((err as Error)?.message ?? '');
    if (/cancel/i.test(message)) {
      return { ok: false, reason: 'cancelled' };
    }
    console.error('[receipt] share failed:', err);
    // The PDF was created fine; only sharing failed. Let the user know where it
    // is rather than implying generation broke.
    Alert.alert('Receipt saved', `Saved to:\n${filePath}`);
    return { ok: true, filePath, reason: 'share-failed' };
  }

  return { ok: true, filePath };
}
