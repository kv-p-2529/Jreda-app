import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { shadowXs } from '@/utils/shadows';

export type ActionTile = {
  key: string;
  label: string;
  icon: string;
  customIcon?: React.ReactNode;
  iconColor: string;
  iconBg: string;
  cardBg?: string;
  onPress?: () => void;
};

interface DashboardActionGridProps {
  title: string;
  tiles: ActionTile[];
  // When true, each tile's background fades from its cardBg → white.
  // When false, tiles use a flat white surface — quieter look for the
  // Tracking section so it doesn't compete with Monitoring above it.
  gradient?: boolean;
}

export default function DashboardActionGrid({
  title,
  tiles,
  gradient = true,
}: DashboardActionGridProps) {
  // Shared dimensions for the tile interior — applied identically to both
  // the gradient and flat-View branches so the layout doesn't shift when
  // `gradient` is toggled.
  const surfaceStyle = {
    paddingVertical: 16,
    paddingHorizontal: 14,
    minHeight: 124,
    justifyContent: 'space-between' as const,
  };

  function Wrapper({
    cardBg,
    children,
  }: {
    cardBg?: string;
    children: React.ReactNode;
  }) {
    if (gradient) {
      return (
        <LinearGradient
          colors={[cardBg ?? '#FFFFFF', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={surfaceStyle}
        >
          {children}
        </LinearGradient>
      );
    }
    return (
      <View style={[surfaceStyle, { backgroundColor: '#FFFFFF' }]}>
        {children}
      </View>
    );
  }

  return (
    <View className="mx-4 mt-6">
      <View
        style={{
          backgroundColor: '#F9FAFE',
          borderRadius: 20,
          paddingHorizontal: 14,
          paddingTop: 16,
          paddingBottom: 8,
          ...shadowXs,
        }}
      >
        <Text className="text-[20px] font-spaceBold text-[#1B1B1B] mb-3 ml-1">
          {title}
        </Text>

        <View className="flex-row flex-wrap" style={{ marginHorizontal: -5 }}>
          {tiles.map(tile => (
            <View
              key={tile.key}
              style={{
                width: '50%',
                paddingHorizontal: 5,
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={tile.onPress}
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: '#E9E9E9',
                  overflow: 'hidden',
                }}
              >
                <Wrapper cardBg={tile.cardBg}>
                  <View
                    className="flex items-center justify-center"
                    style={{
                      width: '100%',
                      borderRadius: 25,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: gradient ? '#ffffff' : '#F9FAFE',
                        borderWidth: 1,
                        borderColor: '#EBEBEB',
                        padding: 16,
                        borderRadius: 100,
                      }}
                    >
                      {tile.customIcon ?? (
                        <Ionicons
                          name={tile.icon as any}
                          size={34}
                          color={tile.iconColor}
                        />
                      )}
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between mt-3">
                    <Text className="text-[#1B1B1B] font-normal flex-1">
                      {tile.label}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#1B1B1B" />
                  </View>
                </Wrapper>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
