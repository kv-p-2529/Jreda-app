import React from 'react';
import { Image, Text, View } from 'react-native';

import jredaLogo from '@assets/logo.png';

// On-screen replica of the official JREDA "PMKUSUM COMP-B Farmer Payment
// Receipt". This is the single source of truth for the receipt layout — the
// HTML used for the downloadable PDF (see receiptHtml.ts) mirrors it field for
// field, so keep the two in sync when the format changes.
//
// Visual anatomy (top → bottom):
//   logo + agency title  →  green "registration successful" line  →
//   green section bars (Payment Info / Farmer Info / Required Pump Details /
//   Disclaimer), each with two label-value columns.

export type ReceiptData = {
  // Payment Info
  paymentReferenceNo: string;
  paymentDate: string;
  bankReferenceNo: string;
  amount: string;
  orderNumber: string;
  paymentMode: string;
  // Farmer Info
  applicationNumber: string;
  mobileNumber: string;
  farmerName: string;
  fatherHusbandName: string;
  applicationCategory: string;
  applicantType: string;
  aadharLast4: string;
  gender: string;
  locationDistrict: string;
  emailId: string;
  // Required Pump Details
  pumpCapacity: string;
  pumpCategory: string;
  pumpSubType: string;
  pumpType: string;
  controllerType: string;
};

// Palette pulled from the printed receipt.
export const RECEIPT_GREEN = '#3C8A3F';
const LABEL = '#1F2937';
const VALUE = '#5B7280';
const BAR_TEXT = '#FFFFFF';

type Field = { label: string; value: string };

function FieldLine({ label, value }: Field) {
  return (
    <Text className="mb-1.5 text-[12px]" style={{ lineHeight: 18 }}>
      <Text style={{ color: LABEL }}>{label} :- </Text>
      <Text style={{ color: VALUE }}>{value}</Text>
    </Text>
  );
}

function SectionBar({ title }: { title: string }) {
  return (
    <View style={{ backgroundColor: RECEIPT_GREEN }} className="py-1">
      <Text
        className="text-center text-[13px] font-bold"
        style={{ color: BAR_TEXT }}
      >
        {title}
      </Text>
    </View>
  );
}

function TwoColumn({ left, right }: { left: Field[]; right: Field[] }) {
  return (
    <View className="flex-row px-4 pt-2.5 pb-1">
      <View className="flex-1 pr-3">
        {left.map(f => (
          <FieldLine key={f.label} label={f.label} value={f.value} />
        ))}
      </View>
      <View className="flex-1 pl-3">
        {right.map(f => (
          <FieldLine key={f.label} label={f.label} value={f.value} />
        ))}
      </View>
    </View>
  );
}

export default function PaymentReceipt({ data }: { data: ReceiptData }) {
  return (
    <View className="bg-white">
      {/* Header */}
      <View className="items-center pt-5 pb-3 px-4">
        <Image
          source={jredaLogo}
          style={{ width: 64, height: 64 }}
          resizeMode="contain"
        />
        <Text
          className="text-center text-[15px] font-bold mt-2"
          style={{ color: '#1B1B1B' }}
        >
          Jharkhand Renewable Energy Development Agency
        </Text>
        <Text
          className="text-center text-[12px] font-bold"
          style={{ color: '#1B1B1B' }}
        >
          PMKUSUM COMP-B Farmer Payment Receipt
        </Text>
      </View>

      {/* Success headline */}
      <Text
        className="text-center text-[18px] font-bold mb-3"
        style={{ color: RECEIPT_GREEN }}
      >
        Your registration is Successful
      </Text>

      {/* Payment Info */}
      <SectionBar title="Payment Info" />
      <TwoColumn
        left={[
          { label: 'Payment Reference No.', value: data.paymentReferenceNo },
          { label: 'Bank Reference No.', value: data.bankReferenceNo },
          { label: 'Order Number', value: data.orderNumber },
        ]}
        right={[
          { label: 'Payment Date', value: data.paymentDate },
          { label: 'Amount', value: data.amount },
          { label: 'Payment Mode', value: data.paymentMode },
        ]}
      />

      {/* Farmer Info */}
      <SectionBar title="Farmer Info" />
      <TwoColumn
        left={[
          { label: 'Application Number', value: data.applicationNumber },
          { label: 'Farmer Name', value: data.farmerName },
          { label: 'Application Category', value: data.applicationCategory },
          { label: 'Aadhar Number Last 4 Digits', value: data.aadharLast4 },
          { label: 'Location District', value: data.locationDistrict },
        ]}
        right={[
          { label: 'Mobile Number', value: data.mobileNumber },
          { label: 'Father/Husband Name', value: data.fatherHusbandName },
          { label: 'Applicant Type', value: data.applicantType },
          { label: 'Gender', value: data.gender },
          { label: 'Email Id', value: data.emailId },
        ]}
      />

      {/* Required Pump Details */}
      <SectionBar title="Required Pump Details" />
      <TwoColumn
        left={[
          { label: 'Pump Capacity', value: data.pumpCapacity },
          { label: 'Pump Sub Type', value: data.pumpSubType },
          { label: 'Controller Type', value: data.controllerType },
        ]}
        right={[
          { label: 'Pump Category', value: data.pumpCategory },
          { label: 'Pump Type', value: data.pumpType },
        ]}
      />

      {/* Disclaimer */}
      <SectionBar title="Disclaimer" />
      <Text
        className="text-center text-[12px] px-5 py-3"
        style={{ color: VALUE, lineHeight: 18 }}
      >
        Payment does not guarantee pump allotment. Allotment is subject to
        eligibility, verification, and availability. Any refund, if applicable,
        will be processed as per the applicable terms and conditions.
      </Text>
    </View>
  );
}
