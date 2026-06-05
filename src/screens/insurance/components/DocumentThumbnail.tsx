import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { shadowXs } from '@/utils/shadows';

// A single uploaded document tile: a photo thumbnail with a download button
// overlay, the file name, and a type / size footer. Used in the Insurance
// policy-documents grid.

interface DocumentThumbnailProps {
  image: ImageSourcePropType;
  name: string;
  type: string; // e.g. "JPG"
  size: string; // e.g. "2.5 MB"
  onDownload?: () => void;
}

export default function DocumentThumbnail({
  image,
  name,
  type,
  size,
  onDownload,
}: DocumentThumbnailProps) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        overflow: 'hidden',
        ...shadowXs,
      }}
    >
      {/* Thumbnail + download action */}
      <View>
        <Image
          source={image}
          style={{ width: '100%', height: 110 }}
          resizeMode="cover"
        />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDownload}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
            ...shadowXs,
          }}
        >
          <Ionicons name="download-outline" size={18} color="#1382F5" />
        </TouchableOpacity>
      </View>

      {/* Meta */}
      <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
        <Text className="text-[12px] text-[#1B1B1B]" numberOfLines={1}>
          {name}
        </Text>
        <View className="flex-row items-center justify-between mt-1.5">
          <Text className="text-[12px] text-[#1B1B1B] font-semibold">{type}</Text>
          <Text className="text-[12px] text-[#8A8A8A]">{size}</Text>
        </View>
      </View>
    </View>
  );
}
