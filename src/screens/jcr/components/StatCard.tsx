import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// A complaints summary tile (Open / Close / Total). Tinted card with a coloured
// bottom edge, a white icon disc, a big count and a label. Fixed width so a row
// of them scrolls horizontally with the next card peeking in.

interface StatCardProps {
  icon: string;
  customIcon?: React.ReactNode;
  accent: string;
  bg: string;
  value: string;
  label: string;
}

export default function StatCard({
  icon,
  customIcon,
  accent,
  bg,
  value,
  label,
}: StatCardProps) {
  return (
    <View
      style={{
        width: 158,
        backgroundColor: bg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        borderBottomWidth: 3,
        borderBottomColor: accent,
        paddingVertical: 22,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {customIcon ?? <Ionicons name={icon as any} size={28} color={accent} />}
      </View>
      <Text style={{ color: accent }} className="text-[34px] font-bold mt-3">
        {value}
      </Text>
      <Text className="text-[16px] text-[#1B1B1B] font-semibold mt-1">
        {label}
      </Text>
    </View>
  );
}
