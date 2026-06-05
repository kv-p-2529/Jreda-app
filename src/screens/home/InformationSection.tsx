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

// Three stacked cards: Public Information, Documents, What's New.
// Each card's body is its own ScrollView (max-h-[420px]) so a long list
// scrolls internally instead of stretching the section.
//
// The data arrays below are stand-ins until the documents API ships. Keep
// the strings here for now — they're plain enough to translate via i18n
// later if needed.

const publicInformation = [
  'District Wise Authority Contact Details',
  'Rate Card',
  'Installer Details',
  'Segregate Data Sanction wise',
];

const documents = [
  'Extension of timeline for financial closure and completion of projects under PM KUSUM scheme - reg',
  'Compliance of specification of the Module Mounting Structure (MMS) through SIAS and Vendors under PM KUSUM scheme - reg',
  'Clarification with regard to the issuance of the Notice to',
];

const whatsNew = [
  'OM dated 30.05.2025 regarding the Compliance of QCO,2017 in PM-KUSUM Scheme',
  'Domestic Content Requirement (DCR) norms for Solar PV Cells-Reg.',
];

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
        <View className="bg-[#F8F8F8] rounded-2xl overflow-hidden mb-8">
          {/* HEADER */}
          <View className="bg-[#1382F5] px-6 py-5">
            <Text className="text-white text-[20px] font-black">
              Public Information
            </Text>
          </View>

          {/* CONTENT */}
          <View className="px-6 py-4 max-h-[420px]">
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {publicInformation.map((item, index) => (
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

        {/* DOCUMENTS */}
        <View className="bg-[#F8F8F8] rounded-2xl overflow-hidden mb-8">
          {/* HEADER */}
          <View className="bg-[#00C300] px-6 py-5 flex-row items-center justify-between">
            <Text className="text-white text-[20px] font-black">Documents</Text>

            <TouchableOpacity className="w-14 h-14 rounded-full border-[5px] border-white items-center justify-center">
              <Ionicons
                style={{ transform: 'rotateZ(45deg)' }}
                name="arrow-up-outline"
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          <View className="px-6 py-4 max-h-[420px]">
            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {documents.map((item, index) => (
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
