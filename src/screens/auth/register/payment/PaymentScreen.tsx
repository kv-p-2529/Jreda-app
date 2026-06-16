import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import { shadowSm, shadowMd } from '@/utils/shadows';

// Last step before the success modal. The payable amount is decided entirely by
// the backend (POST /payment/initiate) — there is no client-side registration /
// convenience / GST math any more — so this screen just renders the order
// reference and the single amount the server returned.

type Props = {
  /** Backend order id from /payment/initiate (shown as the reference). */
  referenceNo: string;
  /** Total payable, in rupees, as returned by /payment/initiate. */
  amount: number;
  /** ISO currency code from the server; defaults to INR. */
  currency?: string;
  /** True while the order is still being created / the amount fetched. */
  initializing?: boolean;
  /** True while the Razorpay checkout is being opened / processed. */
  loading?: boolean;
  onPay: () => void;
  onBack: () => void;
};

const CURRENCY_SYMBOLS: Record<string, string> = { INR: '₹' };

function PaymentScreen({
  referenceNo,
  amount,
  currency = 'INR',
  initializing = false,
  loading = false,
  onPay,
  onBack,
}: Props) {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '';
  const format = (n: number) =>
    `${symbol}${n.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <View className="my-4">
      <StepIndicator current={5} />

      <View className="bg-white rounded-2xl p-5 mb-6" style={shadowMd}>
        <Text className="text-[24px] font-bold text-[#1B1B1B] mb-5">
          Payment Summary
        </Text>

        {initializing ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#1382F5" />
            <Text className="text-[#4B5563] text-[13px] mt-3">
              Preparing your payment…
            </Text>
          </View>
        ) : (
          <>
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

            <View className="flex-row items-center justify-between py-2">
              <Text className="text-[#1B1B1B] text-[18px] font-bold">
                Total Payable
              </Text>
              <Text className="text-[#16A34A] text-[20px] font-extrabold">
                {format(amount)}
              </Text>
            </View>
          </>
        )}
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
        disabled={initializing}
        className="bg-[#1382F5] py-3 mb-3"
        textClassName="text-[18px]"
      />

      <Button
        title="Back"
        onPress={onBack}
        disabled={loading || initializing}
        variant="outline"
        className="border-2 border-[#1382F5] py-3"
        textClassName="text-[18px] text-[#1382F5]"
      />
    </View>
  );
}

export default PaymentScreen;
