import React from 'react';
import { Image, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import FormInput from '@/components/ui/form/FormInput';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowMd } from '@/utils/shadows';
import { showToast } from '@/utils/helpers';
import { AadhaarValues, aadhaarSchema } from './registrationSchemas';

// Step 1 of the registration wizard. Captures the 12-digit Aadhaar number
// and passes it up; the parent then advances to the OTP step where we mask
// the entered number. defaultValues lets the parent re-hydrate this screen
// if the user backs into it.

type Props = {
  defaultValues?: Partial<AadhaarValues>;
  onNext: (values: AadhaarValues) => void;
};

function VerifyAadharScreen({ defaultValues, onNext }: Props) {
  const { control, handleSubmit } = useForm<AadhaarValues>({
    resolver: zodResolver(aadhaarSchema),
    defaultValues: { aadhaar: '', ...defaultValues },
  });

  // Fires only on a valid Aadhaar — mock "send OTP" then advance to the OTP
  // step. Replace the toast with a real send-OTP API call when wired.
  const onVerify = (values: AadhaarValues) => {
    showToast('OTP sent to your Aadhaar-linked mobile number');
    onNext(values);
  };

  return (
    <View className="bg-white rounded-2xl p-5 my-4" style={shadowMd}>
      {/* Step indicator */}
      <StepIndicator current={1} />

      {/* New registration pill */}
      <View className="items-center mb-4">
        <View className="flex-row items-center bg-[#E8F8EC] px-4 py-2 rounded-full">
          <Ionicons name="person-add-outline" size={16} color="#16A34A" />
          <Text className="text-[#16A34A] font-bold ml-2 text-[14px]">
            New Registration
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text className="font-spaceSemiBold text-[26px] text-center text-[#1B1B1B] mb-5">
        Verify your Aadhaar
      </Text>

      {/* Logos */}
      <View className="flex-row items-center justify-between mb-7 px-2">
        <Image
          source={require('@assets/aadhaar1.png')}
          resizeMode="contain"
          style={{ width: 48, height: 48 }}
        />
        <Image
          source={require('@assets/aadhaar2.png')}
          resizeMode="contain"
          style={{ width: 170, height: 50 }}
        />
        <Image
          source={require('@assets/aadhaar3.png')}
          resizeMode="contain"
          style={{ width: 55, height: 55 }}
        />
      </View>

      {/* Input */}
      <FormInput
        control={control}
        name="aadhaar"
        label="Enter 12 Digit Aadhar Number"
        placeholder="1234 5678 9012"
        keyboardType="number-pad"
        maxLength={12}
      />

      <Text className="text-center text-[#555] text-[12px] mt-1 mb-6">
        You will receive OTP on your registered mobile number
      </Text>

      <Button
        title="Verify Aadhar"
        onPress={handleSubmit(onVerify)}
        className="bg-[#1382F5] py-3 mb-3"
        textClassName="text-[18px]"
      />
    </View>
  );
}

export default VerifyAadharScreen;
