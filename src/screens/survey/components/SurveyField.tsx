import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// One read-only Site Survey field. Layout matches the design:
//   Row 1 — an icon in a tinted tile + the label (with an optional grey
//           sub-label like "(Sq. Meter)").
//   Row 2 — the captured value, shown full-width as either plain text
//           (variant="value"), a filled box (variant="input"), or a box with a
//           dropdown chevron (variant="dropdown").
// Everything is presentational; the survey is view-only.

type Variant = 'value' | 'input' | 'dropdown';

interface SurveyFieldProps {
  icon: string;
  label: string;
  subLabel?: string;
  value?: string;
  placeholder?: string;
  variant?: Variant;
}

export default function SurveyField({
  icon,
  label,
  subLabel,
  value,
  placeholder = 'Select',
  variant = 'dropdown',
}: SurveyFieldProps) {
  const hasValue = !!value;

  return (
    <View style={{ marginBottom: 18 }}>
      {/* Label row */}
      <View className="flex-row items-center mb-2">
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            backgroundColor: '#EAF2FE',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon as any} size={17} color="#1382F5" />
        </View>
        <View className="ml-2.5 flex-1">
          <Text className="text-[13.5px] text-[#1B1B1B] font-medium leading-5">
            {label}
          </Text>
          {subLabel && (
            <Text className="text-[11px] text-[#8A8A8A]">{subLabel}</Text>
          )}
        </View>
      </View>

      {/* Value row */}
      {variant === 'value' ? (
        <Text className="text-[15px] text-[#1B1B1B] font-semibold">{value}</Text>
      ) : (
        <View
          style={{
            minHeight: 48,
            backgroundColor: '#F5F6F8',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 13,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: hasValue ? '#111111' : '#A0A0A0',
              flex: 1,
            }}
          >
            {hasValue ? value : placeholder}
          </Text>
          {variant === 'dropdown' && (
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          )}
        </View>
      )}
    </View>
  );
}
