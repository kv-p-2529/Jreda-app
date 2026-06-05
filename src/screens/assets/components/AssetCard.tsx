import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowXs } from '@/utils/shadows';

// A collapsible asset-category card (Pump Controller, Pump, Structure, Solar
// Panel...). The tinted header holds the category icon + title + chevron and
// toggles the body, which is a list of label/value detail rows. Colour comes
// from `accent` (left stripe + icons) and the lighter `headerBg` / `iconBg`.

export type AssetRow = {
  label: string;
  value: string;
  icon?: string; // Ionicons name
  iconText?: string; // rendered as text instead of an icon (e.g. "#")
  customIcon?: React.ReactNode;
};

interface AssetCardProps {
  title: string;
  icon?: string;
  customIcon?: React.ReactNode;
  accent: string;
  headerBg: string;
  iconBg: string;
  rows: AssetRow[];
  defaultExpanded?: boolean;
}

export default function AssetCard({
  title,
  icon,
  customIcon,
  accent,
  headerBg,
  iconBg,
  rows,
  defaultExpanded = true,
}: AssetCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderLeftWidth: 4,
        borderLeftColor: accent,
        overflow: 'hidden',
        marginBottom: 14,
        ...shadowXs,
      }}
    >
      {/* Header — tap to expand/collapse */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(e => !e)}
        style={{
          backgroundColor: headerBg,
          flexDirection: 'row',
          alignItems: 'center',
          padding: 14,
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {customIcon ?? (
            <Ionicons name={(icon ?? 'cube-outline') as any} size={20} color={accent} />
          )}
        </View>
        <Text className="text-[16px] font-bold text-[#1B1B1B] ml-3 flex-1">
          {title}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="#6B7280"
        />
      </TouchableOpacity>

      {/* Body — detail rows */}
      {expanded && (
        <View style={{ paddingHorizontal: 14, paddingVertical: 6 }}>
          {rows.map((row, idx) => (
            <View
              key={`${row.label}-${idx}`}
              className="flex-row items-center"
              style={{
                paddingVertical: 12,
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: '#F4F4F4',
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: iconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {row.customIcon ??
                  (row.iconText ? (
                    <Text style={{ color: accent }} className="text-[16px] font-bold">
                      {row.iconText}
                    </Text>
                  ) : (
                    <Ionicons
                      name={(row.icon ?? 'ellipse-outline') as any}
                      size={18}
                      color={accent}
                    />
                  ))}
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[12px] text-[#8A8A8A]">{row.label}</Text>
                <Text className="text-[14px] text-[#1B1B1B] font-medium mt-0.5">
                  {row.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
