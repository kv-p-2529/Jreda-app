import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import pdfIcon from '@assets/pdf.png';

import InfoListCard from './InfoListCard';
import { documents, publicInformation, whatsNew } from './informationData';

// Three stacked cards: Public Information, Documents, What's New. The first two
// share the InfoListCard shape (header + scrollable checkmark list); What's New
// has its own PDF-tile layout. Card content lives in informationData.ts.

function InformationSection() {
  return (
    <ImageBackground
      source={require('@assets/linesBg.png')}
      resizeMode="cover"
      style={{ backgroundColor: '#FAFDFF' }}
    >
      <View className="px-4 py-10">
        {/* TITLE */}
        <Text className="text-center font-spaceSemiBold text-[32px] font-black text-[#45435D] mb-8">
          Information
        </Text>

        {/* PUBLIC INFORMATION */}
        <InfoListCard
          title="Public Information"
          headerColor="#1382F5"
          items={publicInformation}
        />

        {/* DOCUMENTS */}
        <InfoListCard
          title="Documents"
          headerColor="#00C300"
          items={documents}
          headerAction={
            <TouchableOpacity className="w-14 h-14 rounded-full border-[5px] border-white items-center justify-center">
              <Ionicons
                style={{ transform: 'rotateZ(45deg)' }}
                name="arrow-up-outline"
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          }
        />

        {/* WHAT'S NEW */}
        <View className="bg-[#F8F8F8] rounded-2xl overflow-hidden">
          {/* HEADER */}
          <View className="bg-[#1382F5] px-6 py-5">
            <Text className="text-white text-[20px] font-black">
              What's New
            </Text>
          </View>

          {/* CONTENT */}
          <View className="p-6 max-h-[420px]">
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {whatsNew.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  className="bg-[#F3F3F5] border border-[#E3E3E3] rounded-[24px] p-4 mb-6 flex-row items-center"
                >
                  {/* PDF IMAGE */}
                  <Image
                    source={pdfIcon}
                    className="w-24 h-24"
                    resizeMode="contain"
                  />

                  {/* TEXT */}
                  <Text className="flex-1 ml-4 text-[#004C97] text-sm leading-6 font-semibold">
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

export default InformationSection;
