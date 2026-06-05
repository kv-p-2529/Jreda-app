import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowMd } from '@/utils/shadows';

interface ChatBubbleProps {
  message?: string;
  unreadCount?: number;
  onPress?: () => void;
}

export default function ChatBubble({
  message = 'Hi ! How can we help?',
  unreadCount = 1,
  onPress,
}: ChatBubbleProps) {
  const [visible, setVisible] = useState(true);

  return (
    // Floating overlay anchored to the search card. `pointerEvents="box-none"`
    // here lets taps fall through the empty padding around the bubble so the
    // search inputs underneath stay interactive — only the bubble and pill
    // catch touches.
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: 16,
        top: 95,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 20,
      }}
    >
      {visible && (
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginRight: 8,
            flexDirection: 'row',
            alignItems: 'center',
            ...shadowMd,
          }}
        >
          <Text style={{ fontSize: 14, marginRight: 4 }}>👋</Text>
          <Text className="text-[#1B1B1B] text-[13px] font-medium mr-2">
            {message}
          </Text>
          <TouchableOpacity onPress={() => setVisible(false)} hitSlop={8}>
            <Ionicons name="close" size={14} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}

      {/* Brand-tinted shadow — not from the shared preset because the blue
          glow is intentional and gives the FAB its "active" feel. */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#1382F5',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#1382F5',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
        {unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              backgroundColor: '#22C55E',
              borderRadius: 9,
              minWidth: 18,
              height: 18,
              paddingHorizontal: 4,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#FFFFFF',
            }}
          >
            <Text className="text-white text-[10px] font-bold">
              {unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
