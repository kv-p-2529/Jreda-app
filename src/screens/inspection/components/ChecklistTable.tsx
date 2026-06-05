import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// The Site Inspection checklist — VIEW ONLY. A green-headed table where each row
// pairs a checklist item (icon + text) with its captured answer: a Yes/No radio
// pair (the recorded option filled) or a numeric value with a range hint.
// Purely presentational; point `value` at the inspection record once wired up.

const GREEN = '#22A45A';

export type ChecklistItem = {
  key: string;
  icon: string;
  customIcon?: React.ReactNode;
  label: string;
  type: 'yesno' | 'number';
  value?: string; // 'yes' | 'no' for yesno; the number for number
  hint?: string; // shown under a number value, e.g. "[9 - > =]"
};

function YesNo({ value }: { value?: string }) {
  return (
    <View>
      {['yes', 'no'].map(opt => {
        const checked = value === opt;
        return (
          <View key={opt} className="flex-row items-center mb-1.5">
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
            <Text className="text-[13px] text-[#1B1B1B] capitalize">{opt}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ChecklistTable({ items }: { items: ChecklistItem[] }) {
  return (
    <View
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ECECEC',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', backgroundColor: GREEN }}>
        <Text
          className="text-white font-bold text-[14px]"
          style={{ flex: 1, padding: 12 }}
        >
          CheckList Item
        </Text>
        <Text
          className="text-white font-bold text-[14px]"
          style={{ width: 104, padding: 12 }}
        >
          Input
        </Text>
      </View>

      {/* Rows */}
      {items.map((item, idx) => (
        <View
          key={item.key}
          style={{
            flexDirection: 'row',
            borderTopWidth: idx === 0 ? 0 : 1,
            borderTopColor: '#F1F1F1',
            paddingVertical: 12,
            paddingHorizontal: 12,
            alignItems: 'flex-start',
          }}
        >
          {/* Item: icon + label */}
          <View className="flex-row flex-1 pr-3">
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                backgroundColor: '#E7F8EC',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              {item?.customIcon ?? (
                <Ionicons name={item.icon as any} size={16} color={GREEN} />
              )}
            </View>
            <Text className="text-[13px] text-[#1B1B1B] ml-2.5 flex-1 leading-5">
              {item.label}
            </Text>
          </View>

          {/* Captured input */}
          <View style={{ width: 104, paddingLeft: 30 }}>
            {item.type === 'yesno' ? (
              <YesNo value={item.value} />
            ) : (
              <View>
                <Text
                  className="text-[15px] text-[#111111]"
                  style={{
                    textAlign: 'right',
                    borderBottomWidth: 1,
                    borderBottomColor: '#D1D5DB',
                    paddingBottom: 2,
                  }}
                >
                  {item.value}
                </Text>
                {item.hint && (
                  <Text className="text-[11px] text-[#8A8A8A] mt-1 text-right">
                    {item.hint}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
