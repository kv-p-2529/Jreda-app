import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Svg, { Path } from 'react-native-svg';

import Spacer from '@/components/ui/Spacer';
import { GREEN } from '../inspectionData';

// View-only verification block for the Site Inspection page: verification date,
// the satisfied/not-satisfied verdict, and (commented-out) submit button. All
// values are read straight from the inspection record passed in via props.

type Props = {
  verificationDate: string;
  verdict: 'satisfied' | 'not';
};

function VerdictCard({ verificationDate, verdict }: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: '#ECECEC',
        borderRadius: 14,
        padding: 14,
      }}
    >
      {/* Verification date (view-only) */}
      <View className="flex-row items-center">
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: '#FFF1E6',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="calendar-outline" size={18} color="#F97316" />
        </View>
        <Text className="text-[14px] text-[#1B1B1B] font-medium ml-2.5 flex-1">
          Verification Date
        </Text>
        <Text className="text-[14px] text-[#1B1B1B] font-semibold mr-2">
          {verificationDate}
        </Text>
        <Ionicons name="calendar" size={18} color="#6B7280" />
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: '#F1F1F1',
          marginVertical: 14,
        }}
      />

      {/* Verdict (view-only) */}
      <View className="flex-row items-center mb-3">
        <View
          style={{
            borderRadius: 100,
            padding: 8,
            backgroundColor: '#EDFAEE',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg width="19" height="23" viewBox="0 0 19 23" fill="none">
            <Path
              d="M10.0406 0.275426C9.95354 0.18812 9.85009 0.118852 9.73619 0.0715895C9.62229 0.0243274 9.50019 0 9.37688 0C9.25356 0 9.13146 0.0243274 9.01756 0.0715895C8.90366 0.118852 8.80021 0.18812 8.71312 0.275426C6.3825 2.6023 3.80625 3.7498 0.9375 3.7498C0.68886 3.7498 0.450403 3.84857 0.274588 4.02439C0.0987722 4.2002 0 4.43866 0 4.6873V10.3142C0 16.3498 3.07687 20.4523 9.07875 22.4511C9.27106 22.5151 9.47894 22.5151 9.67125 22.4511C15.6713 20.4523 18.75 16.3498 18.75 10.3142V4.6873C18.75 4.43866 18.6512 4.2002 18.4754 4.02439C18.2996 3.84857 18.0611 3.7498 17.8125 3.7498C14.9419 3.7498 12.3656 2.60605 10.0406 0.275426ZM14.7262 7.77543C14.902 7.95123 15.0007 8.18965 15.0007 8.43824C15.0007 8.68683 14.902 8.92524 14.7262 9.10105L9.10125 14.7261C9.01416 14.8134 8.91071 14.8826 8.79681 14.9299C8.68292 14.9771 8.56081 15.0015 8.4375 15.0015C8.31419 15.0015 8.19208 14.9771 8.07819 14.9299C7.96429 14.8826 7.86084 14.8134 7.77375 14.7261L4.96125 11.9136C4.78521 11.7375 4.68632 11.4988 4.68632 11.2498C4.68632 11.0008 4.78521 10.7621 4.96125 10.5861C5.13729 10.41 5.37605 10.3111 5.625 10.3111C5.87395 10.3111 6.11271 10.41 6.28875 10.5861L8.4375 12.7367L13.3988 7.77543C13.4858 7.68812 13.5893 7.61885 13.7032 7.57159C13.8171 7.52433 13.9392 7.5 14.0625 7.5C14.1858 7.5 14.3079 7.52433 14.4218 7.57159C14.5357 7.61885 14.6392 7.68812 14.7262 7.77543Z"
              fill="#00B100"
            />
          </Svg>
        </View>
        <Text className="text-[14px] text-[#1B1B1B] font-semibold ml-2 flex-1">
          Pump Installation Verification As per Specification
        </Text>
      </View>

      <View className="flex-row" style={{ gap: 12 }}>
        {(
          [
            { key: 'satisfied', label: 'Satisfied' },
            { key: 'not', label: 'Not Satisfied' },
          ] as const
        ).map(opt => {
          const checked = verdict === opt.key;
          return (
            <View
              key={opt.key}
              className="flex-1 flex-row items-center justify-center"
              style={{
                borderWidth: 1,
                borderColor: checked ? GREEN : '#E5E7EB',
                backgroundColor: checked ? '#ECFAF0' : '#FFFFFF',
                borderRadius: 999,
                paddingVertical: 12,
              }}
            >
              <View
                className="w-5 h-5 rounded-full items-center justify-center mr-2"
                style={{
                  borderWidth: 2,
                  borderColor: checked ? GREEN : '#9CA3AF',
                }}
              >
                {checked && (
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: GREEN }}
                  />
                )}
              </View>
              <Text
                className="text-[14px]"
                style={{
                  color: checked ? GREEN : '#1B1B1B',
                  fontWeight: checked ? '600' : '400',
                }}
              >
                {opt.label}
              </Text>
            </View>
          );
        })}
      </View>

      <Spacer size="md" />
      {/* <Button
        title="Submit Inspection"
        onPress={() => {}}
        className="bg-[#1382F5] w-full py-3"
      /> */}
    </View>
  );
}

export default VerdictCard;
