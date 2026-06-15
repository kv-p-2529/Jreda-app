import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import StepIndicator from '@/components/ui/StepIndicator';
import { shadowMd } from '@/utils/shadows';
import { showToast } from '@/utils/helpers';
import { OtpValues, otpSchema } from '../registrationSchemas';
import axios from 'axios';
import throwError from '@/api/throwError';

// Step 2 — split OTP entry across six boxes for the familiar masked-input UX.
// We auto-focus the next box on digit entry and the previous box on backspace
// in an empty field, so users rarely need to tap. The 5-minute resend timer
// is local state; if the user navigates away and back it resets — fine for
// now, but if you want it to persist across re-mounts, hoist into parent.

const OTP_LENGTH = 6;

// How long the user must wait before they can resend the OTP.
const RESEND_SECONDS = 5 * 60;

type Props = {
  aadhaar: any;
  onNext: (values: OtpValues) => void;
  onChangeAadhaar: () => void;
  resendOtp: () => void;
  api: string;
  token: string | null;
};

function VerifyOtpScreen({
  aadhaar,
  onNext,
  onChangeAadhaar,
  resendOtp,
  api,
  token,
}: Props) {
  const { control, handleSubmit, setValue, watch } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '202906' },
  });

  const otp = watch('otp');
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  // Submit runs in two sequential phases, each with its own loader:
  //   'verifying' — checking the OTP
  //   'fetching'  — pulling the applicant's data once the OTP is confirmed
  // The button is disabled for both phases to prevent a double submit.
  const [phase, setPhase] = useState<'idle' | 'verifying' | 'fetching'>('idle');
  const verifyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending mock timer if the user leaves before it resolves.
  useEffect(
    () => () => {
      if (verifyTimer.current) clearTimeout(verifyTimer.current);
    },
    [],
  );

  // Mock verify: first show "Verifying OTP", and only once that completes show
  // "Fetching data" before advancing. Replace each setTimeout with the real
  // verify-OTP and data-fetch API calls when wired — the data fetch must be
  // kicked off in the verify call's success handler, not in parallel.
  const handleVerify = (values: OtpValues) => {
    setPhase('verifying');
    // values?.otp
    const body = {
      aadhaar_number: aadhaar?.aadhaar_number,
      otp: '202906',
      session_token: token,
    };
    axios
      .post(api, body)
      .then(res => {
        const data = res?.data?.data?.data_from_uidai;
        showToast('OTP verified successfully');
        onNext({ ...data, aadhaar_number: aadhaar?.aadhaar_number });
      })
      .catch(err => throwError(err))
      .finally(() => setPhase('idle'));
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // Mock resend: only allowed once the cooldown hits zero. Restarts the timer
  // and notifies the user. Swap the toast for a real resend-OTP API call later.
  const handleResend = () => {
    if (secondsLeft > 0) return;
    resendOtp();
    setSecondsLeft(RESEND_SECONDS);
    showToast('OTP resent to your Aadhaar-linked mobile number');
  };

  // Treat the six visual boxes as a single string. We pad with spaces so the
  // index math doesn't fall off the end, write the new digit, then strip
  // spaces back out. Avoids the bookkeeping of an array-of-digits state.
  const handleDigit = (digit: string, index: number) => {
    const clean = digit.replace(/[^0-9]/g, '').slice(0, 1);
    const current = otp.padEnd(OTP_LENGTH, ' ').split('');
    current[index] = clean || ' ';
    const next = current.join('').replace(/ /g, '').slice(0, OTP_LENGTH);
    setValue('otp', next, { shouldValidate: false });
    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (!otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskedAadhaar = `XXXX XXXX ${
    aadhaar?.aadhaar_number?.slice(-4) || '----'
  }`;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerLabel = `${minutes}:${seconds
    .toString()
    .padStart(2, '0')} minutes`;

  return (
    <View className="bg-white rounded-2xl p-5 my-4" style={shadowMd}>
      <StepIndicator current={1} />

      {/* Masked aadhaar chip */}
      <View className="items-center mb-4">
        <View className="flex-row items-center bg-[#E8F8EC] px-4 py-2 rounded-full">
          <Ionicons name="lock-closed" size={14} color="#16A34A" />
          <Text className="text-[#16A34A] font-bold ml-2 text-[16px] tracking-widest">
            {maskedAadhaar}
          </Text>
        </View>
      </View>

      <Text className="font-spaceSemiBold text-[26px] text-center text-[#1B1B1B] mb-2">
        Enter OTP
      </Text>

      <Text className="text-[#777] text-[14px] text-center mb-6 px-4">
        OTP has been sent to your Aadhar Linked mobile number.
      </Text>

      {/* OTP boxes */}
      <Controller
        control={control}
        name="otp"
        render={({ fieldState }) => {
          const hasError = !!fieldState.error;
          return (
            <View className="flex-row items-center justify-between mb-4">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => {
                const value = otp[index] ?? '';
                return (
                  <TextInput
                    key={index}
                    ref={ref => {
                      inputRefs.current[index] = ref;
                    }}
                    value={value}
                    onChangeText={d => handleDigit(d, index)}
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === 'Backspace') {
                        handleBackspace(index);
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    placeholder="X"
                    placeholderTextColor="#C9C9C9"
                    style={{
                      width: 46,
                      height: 54,
                      borderRadius: 10,
                      backgroundColor: hasError ? '#FEF2F2' : '#F5F5F5',
                      borderWidth: 1,
                      borderColor: hasError ? '#EF4444' : 'transparent',
                      fontSize: 22,
                      color: '#111111',
                      fontWeight: '700',
                    }}
                  />
                );
              })}
            </View>
          );
        }}
      />

      {secondsLeft > 0 ? (
        <Text className="text-center text-[14px] mb-6">
          <Text className="text-[#1B1B1B]">Resend OTP in </Text>
          <Text className="text-[#1382F5] font-semibold">{timerLabel}</Text>
        </Text>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleResend}
          className="mb-6"
        >
          <Text className="text-center text-[14px]">
            <Text className="text-[#1B1B1B]">Didn't get the code? </Text>
            <Text className="text-[#1382F5] font-semibold">Resend OTP</Text>
          </Text>
        </TouchableOpacity>
      )}

      <Button
        title="Verify OTP"
        onPress={handleSubmit(handleVerify)}
        disabled={phase !== 'idle'}
        className="bg-[#1382F5] py-3 mb-3"
        textClassName="text-[18px]"
      />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onChangeAadhaar}
        className="flex-row items-center justify-center"
      >
        <Ionicons name="chevron-back" size={16} color="#1382F5" />
        <Text className="text-[#1382F5] font-semibold ml-1">
          Change Aadhaar Number
        </Text>
      </TouchableOpacity>

      <LoadingOverlay
        visible={phase !== 'idle'}
        message={phase === 'verifying' ? 'Verifying OTP' : 'Fetching data'}
      />
    </View>
  );
}

export default VerifyOtpScreen;
