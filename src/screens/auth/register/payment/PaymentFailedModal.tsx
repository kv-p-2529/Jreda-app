import React from 'react';
import { Modal, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from '@/components/ui/Button';

// Failure twin of RegistrationSuccessModal. Two CTAs:
//   - Retry: bounce back to the payment step with form data intact
//   - Back to Form: jump to the editable details step (in case the user
//     wants to fix something before paying again)

type Props = {
  visible: boolean;
  onRetry: () => void;
  onBackToForm: () => void;
};

const MESSAGES = [
  'Your Registration has not been completed because payment was not successful.',
  'Your entered details are saved.',
  'Please retry playment to complete registration.',
];

export default function PaymentFailedModal({
  visible,
  onRetry,
  onBackToForm,
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
          <View className="items-center mb-4">
            <View className="w-24 h-24 rounded-full bg-[#FEE2E2] items-center justify-center">
              <Ionicons name="warning" size={40} color="#EF4444" />
            </View>
          </View>

          <Text className="text-[22px] font-extrabold text-center text-[#1B1B1B] mb-6">
            Payment Not Completed
          </Text>

          <View className="mb-5">
            {MESSAGES.map((msg, idx) => (
              <View
                key={idx}
                className="bg-[#EFF6FF] rounded-2xl px-4 py-3 mb-3"
              >
                <Text className="text-[#1B1B1B] text-[13px] leading-5">
                  {msg}
                </Text>
              </View>
            ))}
          </View>

          <Button
            title="Retry Payment"
            onPress={onRetry}
            className="bg-[#1382F5] py-3 mb-3"
            textClassName="text-[16px]"
          />

          <Button
            title="Back to Registration Form"
            onPress={onBackToForm}
            variant="outline"
            className="border-2 border-[#1382F5] py-3"
            textClassName="text-[16px] text-[#1382F5]"
          />
        </View>
      </View>
    </Modal>
  );
}
