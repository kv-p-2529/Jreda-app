import React from 'react';
import { Text, View } from 'react-native';

// Step bar shown at the top of the registration flow. Edit STEPS to add/remove
// stages — the visual rendering scales automatically. `current` is 1-indexed
// to match the human-readable step numbers shown to users.
const STEPS = [
  { id: 1, label: 'Aadhaar' },
  { id: 2, label: 'Details' },
  { id: 3, label: 'Documents' },
  { id: 4, label: 'Preview' },
  { id: 5, label: 'Pay' },
];

interface StepIndicatorProps {
  current: number;
}

export default function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <View className="flex-row items-start justify-between mb-6">
      {STEPS.map((step, index) => {
        const isActive = step.id <= current;
        const isLast = index === STEPS.length - 1;

        return (
          <View
            key={step.id}
            className="items-center flex-1"
            style={{ position: 'relative' }}
          >
            {/* Connector line — runs from this step to the next.
                Green when fully traversed (step.id < current), gray otherwise.
                left:60% / right:-40% places it between adjacent circle centers. */}
            {!isLast && (
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  left: '60%',
                  right: '-40%',
                  height: 2,
                  backgroundColor: step.id < current ? '#16A34A' : '#E5E7EB',
                  zIndex: 0,
                }}
              />
            )}

            {/* Circle */}
            <View
              className="w-7 h-7 rounded-full items-center justify-center"
              style={{
                backgroundColor: isActive ? '#16A34A' : '#FFFFFF',
                borderWidth: 1.5,
                borderColor: isActive ? '#16A34A' : '#D1D5DB',
                zIndex: 1,
              }}
            >
              <Text
                className="text-[12px] font-bold"
                style={{ color: isActive ? '#FFFFFF' : '#9CA3AF' }}
              >
                {step.id}
              </Text>
            </View>

            {/* Label */}
            <Text
              className="text-[12px] mt-2"
              style={{
                color: isActive ? '#16A34A' : '#9CA3AF',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
