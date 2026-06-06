import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// Wrapper that gives every form control the same label + spacing treatment.
// FormInput and FormSelect both render their input INSIDE a FormField, so
// labels, required asterisks, and bottom margin are consistent everywhere.
// An optional leading `icon` renders before the label (used by the Survey form).

interface FormFieldProps {
  label?: string;
  required?: boolean;
  icon?: string; // Ionicons name rendered before the label
  children: React.ReactNode;
}

export default function FormField({
  label,
  required,
  icon,
  children,
}: FormFieldProps) {
  return (
    <View className="mb-3">
      {label && (
        <View className="flex-row items-center mb-1.5">
          {icon && (
            <Ionicons
              name={icon as any}
              size={16}
              color="#1382F5"
              style={{ marginRight: 6 }}
            />
          )}
          <Text className="text-[13px] text-[#1B1B1B] font-medium flex-1">
            {label}
            {required && <Text className="text-red-500"> *</Text>}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
}

// Shared input chrome — referenced by FormInput and FormSelect so the
// error-vs-neutral visual treatment is identical across both controls.
// Don't inline these in individual inputs; that's how the form starts to
// look inconsistent.
export const ERROR_BG = '#FEF2F2';
export const ERROR_BORDER = '#EF4444';
export const NEUTRAL_BG = '#F5F5F5';
export const NEUTRAL_BORDER = 'transparent';
// Read-only / disabled controls — visibly greyer than NEUTRAL so users can
// tell at a glance the field can't be edited (fixed state, auto-calc values).
export const DISABLED_BG = '#E5E7EB';
