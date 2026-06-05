import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowXs } from '@/utils/shadows';

// One Performance card, laid out in three rows:
//   Row 1 — icon + title with a unit subtitle beneath it.
//   Row 2 — two stat columns (e.g. Yesterday / Current Month), each a big
//           accent value over a grey label.
//   Row 3 — a full-width centred trend pill ("↗ 12% vs yesterday").
// All four Performance metrics share this shape; only colours/copy change.

export type PerfTrend = {
  direction: 'up' | 'down';
  percent: string; // e.g. "12%"
};

interface PerformanceCardProps {
  icon: string; // Ionicons name (fallback when no customIcon)
  customIcon?: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string; // e.g. "Solar Generation KW"
  subtitle: string; // e.g. "KW (Kilowatt)"
  accent: string; // value text + left stripe colour
  leftLabel: string; // e.g. "Yesterday"
  leftValue: string; // e.g. "0"
  rightLabel: string; // e.g. "Current Month"
  rightValue: string;
  trend: PerfTrend;
  trendBg: string;
}

export default function PerformanceCard({
  icon,
  customIcon,
  iconColor,
  iconBg,
  title,
  subtitle,
  accent,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  trend,
  trendBg,
}: PerformanceCardProps) {
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
      {/* Row 1 — icon + title + subtitle */}
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
        <View className="ml-3 flex-1">
          <Text
            className="text-[16px] font-semibold text-[#1B1B1B]"
            numberOfLines={2}
          >
            {title}
          </Text>
          <Text className="text-[13px] text-[#8A8A8A] mt-0.5">{subtitle}</Text>
        </View>
      </View>

      {/* Row 2 — two centred stat columns split by a vertical divider */}
      <View className="flex-row mt-5">
        <View className="flex-1 items-center">
          <Text style={{ color: accent }} className="text-[24px] font-bold">
            {leftValue}
          </Text>
          <Text className="text-[13px] text-[#8A8A8A] mt-1">{leftLabel}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#ECECEC' }} />
        <View className="flex-1 items-center">
          <Text style={{ color: accent }} className="text-[24px] font-bold">
            {rightValue}
          </Text>
          <Text className="text-[13px] text-[#8A8A8A] mt-1">{rightLabel}</Text>
        </View>
      </View>

      {/* Row 3 — trend pill sized to its content (max-content) and centred,
          "vs yesterday" stacked below. */}
      <View
        style={{
          backgroundColor: trendBg,
          borderRadius: 12,
          paddingVertical: 10,
          paddingHorizontal: 24,
          marginTop: 16,
          alignSelf: 'center',
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
        <Text className="text-[12px] text-[#8A8A8A] mt-0.5">vs yesterday</Text>
      </View>
    </View>
  );
}
