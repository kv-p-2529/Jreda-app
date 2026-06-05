import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// Dashed-border "upload" call-to-action used at the bottom of the Insurance
// documents list. Presentational — the parent wires up the actual file picker.

interface UploadDropzoneProps {
  title?: string;
  hint?: string;
  onPress?: () => void;
}

export default function UploadDropzone({
  title = 'Upload Policy Document',
  hint = 'JPG, PNG, PDF (Max 10MB)',
  onPress,
}: UploadDropzoneProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        borderColor: '#F59E0B',
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderRadius: 14,
        padding: 16,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: '#F97316',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="camera" size={24} color="#FFFFFF" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[15px] font-bold text-[#1B1B1B]">{title}</Text>
        <Text className="text-[12px] text-[#8A8A8A] mt-0.5">{hint}</Text>
      </View>
    </TouchableOpacity>
  );
}
