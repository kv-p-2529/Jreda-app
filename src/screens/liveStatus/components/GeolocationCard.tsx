import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowXs } from '@/utils/shadows';

// The Geolocation row in Live Status. Unlike the metric cards it shows a
// lat/long readout with a live indicator and a round "open map" action button
// instead of a trend pill.

interface GeolocationCardProps {
  latitude?: string;
  longitude?: string;
  live?: boolean;
  onOpenMap?: () => void;
}

export default function GeolocationCard({
  latitude = '--',
  longitude = '--',
  live = true,
  onOpenMap,
}: GeolocationCardProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderLeftWidth: 4,
        borderLeftColor: '#1382F5',
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
            backgroundColor: '#E6F0FF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="location" size={24} color="#1382F5" />
        </View>
        <View style={{ flexDirection: 'column', marginLeft: 16 }}>
          <Text className="text-[16px] font-semibold text-[#1B1B1B]">
            Geolocation
          </Text>
          <Text className="text-[13px] text-[#8A8A8A]">
            Latitude : {latitude}　Longitude : {longitude}
          </Text>
        </View>
      </View>

      {/* Row 2 — readout + open-map action */}
      <View className="flex-row items-center justify-between mt-4">
        <View>
          {live && (
            <View
              className="flex-row items-center"
              style={{
                borderWidth: 1,
                borderColor: '#F0F0F0',
                borderRadius: 100,
                paddingHorizontal: 18,
                paddingVertical: 8,
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: '#16A34A',
                }}
              />
              <Text className="text-[14px] text-[#16A34A] font-semibold ml-1.5">
                Live
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenMap}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            backgroundColor: '#1382F5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
