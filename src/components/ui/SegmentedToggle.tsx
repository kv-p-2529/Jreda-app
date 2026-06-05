import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

// A row of radio-style segments (e.g. "Current Month" / "Last Month"). Each
// option is an equal-width bordered pill with a radio dot; the selected one is
// tinted blue. Generic and controlled — the parent owns the value.

export type ToggleOption = {
  label: string;
  value: string;
};

interface SegmentedToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function SegmentedToggle({
  options,
  value,
  onChange,
}: SegmentedToggleProps) {
  return (
    <View className="flex-row" style={{ gap: 12 }}>
      {options.map(opt => {
        const checked = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
            className="flex-1 flex-row items-center justify-center"
            style={{
              borderWidth: 1,
              borderColor: checked ? '#1382F5' : '#E5E7EB',
              backgroundColor: checked ? '#F4F9FF' : '#FFFFFF',
              borderRadius: 999,
              paddingVertical: 12,
            }}
          >
            <View
              className="w-5 h-5 rounded-full items-center justify-center mr-2"
              style={{
                borderWidth: 2,
                borderColor: checked ? '#1382F5' : '#9CA3AF',
              }}
            >
              {checked && (
                <View
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: '#1382F5' }}
                />
              )}
            </View>
            <Text
              className="text-[14px]"
              style={{
                color: checked ? '#1382F5' : '#1B1B1B',
                fontWeight: checked ? '600' : '400',
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
