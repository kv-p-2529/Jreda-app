import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from '@/components/ui/Button';

// Bespoke success modal for registration completion. We don't reuse the
// generic SuccessScreen because this one has a receipt panel and a special
// "Payment Unsuccessful Demo link" footer hook for QA — both would feel
// shoehorned through the generic component's props.

type Props = {
  visible: boolean;
  applicationId: string;
  paymentId: string;
  dateTime: string;
  amount: string;
  onGoToDashboard: () => void;
  onDownloadReceipt: () => void;
  onShowFailureDemo?: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-start py-2">
      <Text className="text-[#6B7280] text-[14px] flex-1">{label}</Text>
      <Text
        className="text-[#1B1B1B] text-[14px] font-semibold flex-1 text-right"
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

export default function RegistrationSuccessModal({
  visible,
  applicationId,
  paymentId,
  dateTime,
  amount,
  onGoToDashboard,
  onDownloadReceipt,
  onShowFailureDemo,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/90 items-center justify-center px-6">
        <View
          className="w-full bg-white rounded-3xl p-6"
          style={{
            maxWidth: 420,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Decorative dots */}
          <View className="items-center mb-3 relative">
            <View
              style={{ position: 'absolute', top: -2, left: 60 }}
              className="w-2 h-2 rotate-12"
            >
              <Ionicons name="star" size={12} color="#1382F5" />
            </View>
            <View style={{ position: 'absolute', top: -8, right: 56 }}>
              <Ionicons name="star" size={14} color="#FB923C" />
            </View>
            <View
              style={{ position: 'absolute', top: 18, right: 44 }}
              className="w-2 h-2 rounded-full bg-[#22C55E]"
            />
            <View
              style={{ position: 'absolute', top: 36, right: 70 }}
              className="w-1.5 h-1.5 rounded-full bg-[#FB923C]"
            />

            {/* Big check */}
            <View className="w-24 h-24 rounded-full bg-[#DCFCE7] items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-[#22C55E] items-center justify-center">
                <Ionicons name="checkmark" size={36} color="#fff" />
              </View>
            </View>
          </View>

          <Text className="text-[22px] font-extrabold text-center text-[#1B1B1B] mt-3">
            Registration Successful !!!
          </Text>
          <Text className="text-center text-[#6B7280] mt-2 mb-5 px-2">
            Your PM-KUSUM registration has been completed successfully.
          </Text>

          {/* Details */}
          <View className="bg-[#EFF6FF] rounded-2xl p-4 mb-5">
            <Row label="Application ID:" value={applicationId} />
            <Row label="Payment ID:" value={paymentId} />
            <Row label="Date & Time:" value={dateTime} />
            <Row label="Amount Paid:" value={amount} />
          </View>

          <Button
            title="Go to Dashboard"
            onPress={onGoToDashboard}
            className="bg-[#1382F5] py-3 mb-3"
            textClassName="text-[16px]"
          />

          <Button
            title="Download Receipt"
            onPress={onDownloadReceipt}
            variant="outline"
            className="border-2 border-[#1382F5] py-3"
            textClassName="text-[16px] text-[#1382F5]"
          />
        </View>

        {onShowFailureDemo && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onShowFailureDemo}
            className="mt-6"
          >
            <Text className="text-[#6B7280] text-[16px] font-semibold">
              Payment Unsuccessful Demo link
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}
