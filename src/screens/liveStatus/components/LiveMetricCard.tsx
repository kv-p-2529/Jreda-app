import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowXs } from '@/utils/shadows';

// One Live Status card, laid out in two rows:
//   Row 1 — icon + title together.
//   Row 2 — value/unit stacked on the left, "vs yesterday" trend card on the
//           right.
// Solar Generation, Water Flow, Runtime, Energy and Water Discharge are all the
// same shape — only the colours/copy change — so they share this component.

export type MetricTrend = {
  direction: 'up' | 'down';
  percent: string; // e.g. "12%"
};

interface LiveMetricCardProps {
  icon: string; // Ionicons name
  customIcon?: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string; // e.g. "2 KW", "05:45", "23,450"
  unit: string; // e.g. "KW (Kilowatt)"
  accent: string; // value text + left stripe colour
  trend: MetricTrend;
  trendBg: string;
}

export default function LiveMetricCard({
  icon,
  customIcon,
  iconColor,
  iconBg,
  title,
  value,
  unit,
  accent,
  trend,
  trendBg,
}: LiveMetricCardProps) {
  // Up = improvement (green), down = decline (red). Matches the arrow glyph.
  const trendColor = trend.direction === 'up' ? '#16A34A' : '#DC2626';

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderLeftWidth: 4,
        borderLeftColor: accent,
        padding: 16,
        marginBottom: 14,
        ...shadowXs,
      }}
    >
      {/* Row 1 — icon + title */}
      <View className="flex-row items-center">
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {customIcon ?? (
            <Ionicons name={icon as any} size={24} color={iconColor} />
          )}
        </View>
        <Text
          className="text-[16px] font-semibold text-[#1B1B1B] ml-3 flex-1"
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>

      {/* Row 2 — value/unit + trend card */}
      <View className="flex-row items-center justify-between mt-4">
        <View>
          <Text style={{ color: accent }} className="text-[26px] font-semibold">
            {value}
          </Text>
          <Text className="text-[13px] text-[#8A8A8A] mt-1">{unit}</Text>
        </View>

        <View
          style={{
            backgroundColor: trendBg,
            borderRadius: 14,
            paddingHorizontal: 18,
            paddingVertical: 12,
            alignItems: 'center',
          }}
        >
          <View className="flex-row items-center">
            <Ionicons
              name={trend.direction === 'up' ? 'trending-up' : 'trending-down'}
              size={16}
              color={trendColor}
            />
            <Text className="text-[14px] font-bold text-[#1B1B1B] ml-1.5">
              {trend.percent}
            </Text>
          </View>
          <Text className="text-[11px] text-[#8A8A8A] mt-1">vs yesterday</Text>
        </View>
      </View>
    </View>
  );
}
