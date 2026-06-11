import { Image } from 'react-native';

import jredaLogo from '@assets/logo.png';
import { ReceiptData, RECEIPT_GREEN } from './PaymentReceipt';

// HTML twin of <PaymentReceipt />, fed to react-native-html-to-pdf. Kept in
// this file (not inlined in the PDF helper) so the markup stays readable and
// side-by-side comparable with the on-screen component. When the receipt layout
// changes, change BOTH this and PaymentReceipt.tsx.

// Bundled asset → uri the PDF WebView can load (http in dev via Metro, a
// file:///android_asset path in release). Resolved lazily so importing this
// module never touches native asset resolution at load time.
function logoUri(): string {
  return Image.resolveAssetSource(jredaLogo)?.uri ?? '';
}

const esc = (s: string) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const line = (label: string, value: string) =>
  `<p class="field"><span class="lbl">${esc(label)} :- </span><span class="val">${esc(
    value,
  )}</span></p>`;

const bar = (title: string) => `<div class="bar">${esc(title)}</div>`;

const twoCol = (left: string, right: string) =>
  `<div class="cols"><div class="col">${left}</div><div class="col">${right}</div></div>`;

export function buildReceiptHtml(data: ReceiptData): string {
  const paymentInfo = twoCol(
    line('Payment Reference No.', data.paymentReferenceNo) +
      line('Bank Reference No.', data.bankReferenceNo) +
      line('Order Number', data.orderNumber),
    line('Payment Date', data.paymentDate) +
      line('Amount', data.amount) +
      line('Payment Mode', data.paymentMode),
  );

  const farmerInfo = twoCol(
    line('Application Number', data.applicationNumber) +
      line('Farmer Name', data.farmerName) +
      line('Application Category', data.applicationCategory) +
      line('Aadhar Number Last 4 Digits', data.aadharLast4) +
      line('Location District', data.locationDistrict),
    line('Mobile Number', data.mobileNumber) +
      line('Father/Husband Name', data.fatherHusbandName) +
      line('Applicant Type', data.applicantType) +
      line('Gender', data.gender) +
      line('Email Id', data.emailId),
  );

  const pumpDetails = twoCol(
    line('Pump Capacity', data.pumpCapacity) +
      line('Pump Sub Type', data.pumpSubType) +
      line('Controller Type', data.controllerType),
    line('Pump Category', data.pumpCategory) + line('Pump Type', data.pumpType),
  );

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  * { box-sizing: border-box; }
  body {
    font-family: Helvetica, Arial, sans-serif;
    color: #1F2937;
    margin: 0;
    padding: 24px 28px;
  }
  .header { text-align: center; margin-bottom: 14px; }
  .header img { width: 72px; height: 72px; object-fit: contain; }
  .agency { font-size: 15px; font-weight: bold; margin-top: 6px; color: #1B1B1B; }
  .subtitle { font-size: 12px; font-weight: bold; color: #1B1B1B; }
  .headline {
    text-align: center;
    font-size: 19px;
    font-weight: bold;
    color: ${RECEIPT_GREEN};
    margin: 8px 0 14px;
  }
  .bar {
    background: ${RECEIPT_GREEN};
    color: #ffffff;
    font-size: 13px;
    font-weight: bold;
    text-align: center;
    padding: 4px 0;
  }
  .cols { display: flex; width: 100%; padding: 8px 16px 4px; }
  .col { flex: 1; }
  .col:first-child { padding-right: 12px; }
  .col:last-child { padding-left: 12px; }
  .field { font-size: 12px; line-height: 18px; margin: 0 0 6px; }
  .lbl { color: #1F2937; }
  .val { color: #5B7280; }
  .disclaimer {
    text-align: center;
    font-size: 12px;
    color: #5B7280;
    line-height: 18px;
    padding: 12px 20px;
  }
</style>
</head>
<body>
  <div class="header">
    <img src="${logoUri()}" />
    <div class="agency">Jharkhand Renewable Energy Development Agency</div>
    <div class="subtitle">PMKUSUM COMP-B Farmer Payment Receipt</div>
  </div>

  <div class="headline">Your registration is Successful</div>

  ${bar('Payment Info')}
  ${paymentInfo}

  ${bar('Farmer Info')}
  ${farmerInfo}

  ${bar('Required Pump Details')}
  ${pumpDetails}

  ${bar('Disclaimer')}
  <div class="disclaimer">Payment does not guarantee pump allotment. Allotment is subject to eligibility, verification, and availability. Any refund, if applicable, will be processed as per the applicable terms and conditions.</div>
</body>
</html>`;
}
