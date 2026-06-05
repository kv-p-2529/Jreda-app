import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowSm } from '@/utils/shadows';

// Grouping container used inside the registration form to bucket related
// fields under a titled card. The optional `onEdit` puts an "Edit" link in the
// header — used on the Preview screen to jump back to a specific step.

interface FormSectionProps {
  title: string;
  icon?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  icon,
  onEdit,
  children,
}: FormSectionProps) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4" style={shadowSm}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1">
          {icon && (
            <View className="w-8 h-8 rounded-full bg-[#E8F1FF] items-center justify-center mr-2">
              <Ionicons name={icon as any} size={18} color="#1382F5" />
            </View>
          )}
          <Text className="text-[18px] font-bold text-[#1B1B1B] flex-1">
            {title}
          </Text>
        </View>
        {onEdit && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onEdit}
            className="flex-row items-center"
          >
            <Ionicons name="pencil" size={14} color="#1382F5" />
            <Text className="text-[#1382F5] text-[13px] ml-1 font-semibold">
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}
