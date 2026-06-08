import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// A titled card with a colored header and a scrollable checkmark list — the
// shared shape behind the "Public Information" and "Documents" sections.
// `headerAction` renders an optional control on the right of the header (e.g.
// the Documents expand button).

type Props = {
  title: string;
  headerColor: string;
  items: string[];
  headerAction?: React.ReactNode;
  className?: string;
};

function InfoListCard({
  title,
  headerColor,
  items,
  headerAction,
  className = 'mb-8',
}: Props) {
  return (
    <View className={`bg-[#F8F8F8] rounded-2xl overflow-hidden ${className}`}>
      {/* HEADER */}
      <View
        className="px-6 py-5 flex-row items-center justify-between"
        style={{ backgroundColor: headerColor }}
      >
        <Text className="text-white text-[20px] font-black">{title}</Text>
        {headerAction}
      </View>

      {/* CONTENT */}
      <View className="px-6 py-4 max-h-[420px]">
        <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {items.map((item, index) => (
            <View
              key={index}
              className="flex-row items-start py-2 border-b border-[#E5E5E5]"
            >
              <Ionicons name="checkmark-circle" size={26} color="#00B900" />

              <Text className="flex-1 ml-4 text-[#1B1B1B] text-sm leading-6 font-medium">
                {item}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default InfoListCard;
