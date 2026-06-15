import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import { shadowSm, shadowMd } from '@/utils/shadows';

// Last step before the success modal. The parent owns the fee math too
// (so it can match the amount shown on the success receipt), but we
// recompute here defensively in case props ever diverge — `format` keeps
// the ₹/Indian grouping consistent across both surfaces.

type Props = {
  referenceNo: string;
  registrationFee: number;
  convenienceFee: number;
  gstPercent: number;
  /** True while the Razorpay checkout is being opened / processed. */
  loading?: boolean;
  onPay: () => void;
  onBack: () => void;
};

// Single label/value row inside the summary card. Tiny enough to keep here
// rather than spinning up a dedicated file.
function Line({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-[#4B5563] text-[14px]">{label}</Text>
      <Text className="text-[#1B1B1B] text-[14px] font-semibold">{value}</Text>
    </View>
  );
}

function PaymentScreen({
  referenceNo,
  registrationFee,
  convenienceFee,
  gstPercent,
  loading = false,
  onPay,
  onBack,
}: Props) {
  const baseTotal = registrationFee + convenienceFee;
  const gstAmount = (baseTotal * gstPercent) / 100;
  const total = baseTotal + gstAmount;

  const format = (n: number) =>
    `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View className="my-4">
      <StepIndicator current={5} />

      <View className="bg-white rounded-2xl p-5 mb-6" style={shadowMd}>
        <Text className="text-[24px] font-bold text-[#1B1B1B] mb-5">
          Payment Summary
        </Text>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[#1382F5] text-[14px] font-semibold">
            Reference No.
          </Text>
          <View className="bg-[#E8F8EC] px-3 py-1 rounded-md">
            <Text className="text-[#16A34A] font-bold text-[13px]">
              {referenceNo}
            </Text>
          </View>
        </View>

        <View className="h-px bg-[#F0F0F0] my-2" />

        <Line label="Registration Fee" value={format(registrationFee)} />
        <Line label="Convenience Fee" value={format(convenienceFee)} />
        <Line label={`GST (${gstPercent}%)`} value={format(gstAmount)} />

        <View className="h-px bg-[#F0F0F0] my-2" />

        <View className="flex-row items-center justify-between py-2">
          <Text className="text-[#1B1B1B] text-[18px] font-bold">
            Total Payable
          </Text>
          <Text className="text-[#16A34A] text-[20px] font-extrabold">
            {format(total)}
          </Text>
        </View>
      </View>

      {/* Important info */}
      <View className="bg-white rounded-2xl p-5 mb-6" style={shadowSm}>
        <View className="flex-row items-center mb-3">
          <Ionicons name="information-circle" size={22} color="#1382F5" />
          <Text className="text-[#1382F5] text-[18px] font-bold ml-2">
            Important Information
          </Text>
        </View>

        <Text className="text-[#1B1B1B] text-[13px] leading-6 mb-3">
          Your Application Will Not Be Registered Until The Payment Is
          Successful.
        </Text>

        <Text className="text-[#1B1B1B] text-[13px] leading-6">
          If The Payment Fails Or Is Cancelled, Your Application Details Will
          Be Saved And You Can Retry The Payment Anytime.
        </Text>
      </View>

      <Button
        title="Pay Now"
        onPress={onPay}
        loading={loading}
        className="bg-[#1382F5] py-3 mb-3"
        textClassName="text-[18px]"
      />

      <Button
        title="Back"
        onPress={onBack}
        disabled={loading}
        variant="outline"
        className="border-2 border-[#1382F5] py-3"
        textClassName="text-[18px] text-[#1382F5]"
      />
    </View>
  );
}

export default PaymentScreen;
