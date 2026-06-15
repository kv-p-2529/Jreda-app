import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import { PickedFile } from '../registrationSchemas';

// Presentational rows for the registration Preview (step 4): a read-only
// label/value row, an uploaded-document status row, and a declaration checkbox.

export function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View className="mb-3">
      <Text className="text-[#6B7280] text-[12px]">{label}</Text>
      <Text className="text-[#1B1B1B] text-[14px] font-semibold mt-0.5">
        {value || '-'}
      </Text>
    </View>
  );
}

export function DocumentRow({
  label,
  file,
}: {
  label: string;
  file: PickedFile | null;
}) {
  const uploaded = !!file;
  return (
    <View className="flex-row items-center mb-3">
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: uploaded ? '#F0FDF4' : '#FEF2F2' }}
      >
        <Ionicons
          name={uploaded ? 'document-text-outline' : 'alert-circle-outline'}
          size={18}
          color={uploaded ? '#16A34A' : '#EF4444'}
        />
      </View>
      <View className="flex-1">
        <Text className="text-[#1B1B1B] text-[13px] font-semibold leading-5">
          {label}
        </Text>
        <Text
          className="text-[12px] mt-0.5"
          numberOfLines={1}
          style={{ color: uploaded ? '#16A34A' : '#EF4444' }}
        >
          {uploaded ? file.name : 'Not uploaded'}
        </Text>
      </View>
      {uploaded && (
        <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
      )}
    </View>
  );
}

export function Checkbox({
  checked,
  onToggle,
  label,
  hasError,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  hasError?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      className="flex-row items-start mb-3 p-2 rounded-lg"
      style={{
        backgroundColor: hasError ? '#FEF2F2' : 'transparent',
        borderWidth: hasError ? 1 : 0,
        borderColor: hasError ? '#EF4444' : 'transparent',
      }}
    >
      <View
        className="w-5 h-5 rounded items-center justify-center mt-0.5 mr-3"
        style={{
          backgroundColor: checked ? '#1382F5' : 'transparent',
          borderWidth: 1.5,
          borderColor: checked
            ? '#1382F5'
            : hasError
            ? '#EF4444'
            : '#9CA3AF',
        }}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <Text className="text-[#1B1B1B] text-[13px] flex-1 leading-5">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
