import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, useController, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';

import lock from '@assets/lock.png';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from '@/components/ui/Button';
import { loginSuccess } from '@/store/slices/authSlice';
import { shadowSm } from '@/utils/shadows';

// Login is mobile + OTP. Rendered inside AppModal from AppLayout — that's why
// it doesn't have a Header of its own and uses closeModal to dismiss.
//
// Current onLogin is a mock: it dispatches loginSuccess locally without an
// API call. When the real auth endpoint is wired, replace the dispatch with
// a thunk that calls apiClient and dispatches based on the response.

const loginSchema = z.object({
  mobile: z
    .string()
    .min(10, 'Mobile must be 10 digits')
    .max(10, 'Mobile must be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile'),
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'Only digits allowed'),
});

type LoginValues = z.infer<typeof loginSchema>;

// Dummy OTP for the mock auth flow — replace with a real verify call later.
const DUMMY_OTP = '123456';

// How long the user must wait before they can resend the OTP.
const RESEND_SECONDS = 120;

// Seconds -> "M:SS" for the resend countdown.
const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Lightweight toast: native Toast on Android, Alert fallback elsewhere.
function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(message);
  }
}

// Small Indian tricolour flag for the +91 country-code chip — drawn with views
// so it renders identically on every platform (Android won't show flag emoji).
function FlagIN() {
  return (
    <View
      style={{
        width: 26,
        height: 18,
        borderRadius: 3,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#E5E7EB',
      }}
    >
      <View style={{ flex: 1, backgroundColor: '#FF9933' }} />
      <View
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 5,
            height: 5,
            borderRadius: 3,
            borderWidth: 1,
            borderColor: '#0A3DA6',
          }}
        />
      </View>
      <View style={{ flex: 1, backgroundColor: '#138808' }} />
    </View>
  );
}

interface IconInputProps {
  control: Control<LoginValues>;
  name: keyof LoginValues;
  icon: React.ReactNode;
  placeholder: string;
  keyboardType?: 'phone-pad' | 'number-pad';
  maxLength?: number;
  disabled?: boolean;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
}

// Login-specific input wrapper. Visually distinct from FormInput (left icon,
// bordered chip style, no required asterisk), so it lives here rather than
// in the shared form/ folder.
function IconInput({
  control,
  name,
  icon,
  placeholder,
  keyboardType,
  maxLength,
  disabled,
  secureTextEntry,
  rightElement,
}: IconInputProps) {
  const { field, fieldState } = useController({ control, name });
  const hasError = !!fieldState.error;

  return (
    <View
      className="h-14 rounded-xl flex-row items-center px-4"
      style={{
        borderWidth: 1,
        borderColor: hasError ? '#EF4444' : '#D9DCE3',
        backgroundColor: hasError ? '#FEF2F2' : '#F8F9FC',
        // Disabled (e.g. OTP before it's sent): drain the colour and dim it.
        opacity: disabled ? 0.5 : 1,
        filter: disabled ? [{ saturate: 0 }] : undefined,
      }}
    >
      {icon}
      <TextInput
        value={field.value ?? ''}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        editable={!disabled}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor="#A0A4B0"
        keyboardType={keyboardType}
        maxLength={maxLength}
        className="flex-1 ml-3 text-[16px] text-black"
      />
      {rightElement}
    </View>
  );
}

export default function LoginScreen() {
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const { control, handleSubmit, trigger } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mobile: '', otp: '' },
  });

  // The OTP field stays disabled until the user has requested (and we've
  // "sent") the OTP. `secondsLeft` drives the resend cooldown.
  const [otpSent, setOtpSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Tick the resend countdown down to zero. Re-running on `secondsLeft` means a
  // fresh send (which resets it to RESEND_SECONDS) restarts the timer cleanly.
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const onLogin = (values: LoginValues) => {
    if (values.otp !== DUMMY_OTP) {
      showToast('Invalid OTP. Please try again.');
      return;
    }
    dispatch(
      loginSuccess({
        user: {
          id: '1',
          name: 'Agast Panday',
          email: '',
          role: 'farmer',
        },
        token: `mock-token-${values.mobile}`,
      }),
    );
  };

  const onGetOtp = async () => {
    const ok = await trigger('mobile');
    if (!ok) return;
    // Mock send: unlock the OTP field, start the resend cooldown, and notify
    // the user. The accepted OTP is DUMMY_OTP until a real verify endpoint is
    // wired up.
    setOtpSent(true);
    setSecondsLeft(RESEND_SECONDS);
    showToast('OTP has been sent to your mobile number');
  };

  const goToRegister = () => {
    navigate('Register');
  };

  return (
    <View
      className="rounded-[22px] p-2 relative"
      style={{
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#D9DCE3',
        borderRadius: 10,
        marginTop: 170,
        marginBottom: 10,
        marginHorizontal: 10,
        padding: 20,
        ...shadowSm,
      }}
    >
      {/* Floating Icon */}
      <View className="absolute -top-12 right-6 h-24 w-24 rounded-full items-center justify-center shadow-lg">
        <Image source={lock} resizeMode="contain" />
      </View>

      {/* Title */}
      <Text className="text-[25px] font-spaceMedium text-[#1A1A1A] mt-2">
        Member Login
      </Text>

      {/* Mobile Number */}
      <Text className="text-[#7B7B7B] text-[15px] mt-6 mb-2">
        Mobile Number
      </Text>

      <IconInput
        control={control}
        name="mobile"
        icon={
          <TouchableOpacity
            className="flex-row items-center"
            activeOpacity={0.7}
          >
            <MaterialIcons name="phone" size={20} color="#1382F5" />
          </TouchableOpacity>
        }
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* Get OTP — sends, then acts as resend once the cooldown ends */}
      <View className="flex-row justify-end mt-2">
        <TouchableOpacity
          onPress={onGetOtp}
          activeOpacity={0.7}
          disabled={secondsLeft > 0}
        >
          <Text
            className="font-semibold text-[15px]"
            style={{
              color: secondsLeft > 0 ? '#9CA3AF' : '#00B000',
              textDecorationLine: 'underline',
            }}
          >
            {otpSent && secondsLeft === 0 ? 'Resend OTP' : 'Get OTP'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* OTP label */}
      <Text className="text-[#7B7B7B] text-[15px] mt-4 mb-2">OTP</Text>

      {/* OTP Input — with show/hide toggle */}
      <IconInput
        control={control}
        name="otp"
        icon={<MaterialIcons name="lock-outline" size={22} color="#2563EB" />}
        placeholder={`Enter the OTP ${otpSent ? '(123456)' : ''}`}
        keyboardType="number-pad"
        maxLength={6}
        disabled={!otpSent}
        secureTextEntry={!showOtp}
        rightElement={
          <TouchableOpacity
            onPress={() => setShowOtp(s => !s)}
            activeOpacity={0.7}
            disabled={!otpSent}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showOtp ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        }
      />

      {/* Remember Me + resend countdown */}
      <View className="flex-row items-center justify-between mt-4">
        <TouchableOpacity
          className="flex-row items-center"
          activeOpacity={0.7}
          onPress={() => setRememberMe(r => !r)}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: rememberMe ? '#1382F5' : 'transparent',
              borderWidth: rememberMe ? 0 : 1.5,
              borderColor: '#9CA3AF',
            }}
          >
            {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text className="ml-2 text-[14px] text-[#1A1A1A]">Remember Me</Text>
        </TouchableOpacity>

        {secondsLeft > 0 && (
          <Text className="text-[14px] text-[#7B7B7B]">
            {formatTime(secondsLeft)} Sec Left
          </Text>
        )}
      </View>

      {/* Button */}
      <Button
        title="Login"
        onPress={handleSubmit(onLogin)}
        className="mt-6 bg-[#1382F5] h-14"
        textClassName="text-[18px]"
      />

      {/* Register link */}
      <TouchableOpacity onPress={goToRegister}>
        <Text className="text-[#00aeff] text-[16px] font-spaceSemiBold text-center mt-4">
          New here ? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}
