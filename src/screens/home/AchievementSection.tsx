import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { dashboardData } from './achievementData';

// "Achievement Dashboard" — horizontal carousel of donut charts, one per
// program component. The per-card data (theme, chart, stats, legend) lives in
// achievementData.tsx; this file is just the carousel layout.

function AchievementSection() {
  return (
    <View className="mt-8">
      <Text className="text-center font-spaceBold text-[28px] text-[#333]">
        Achievement Dashboard
      </Text>

      <Text className="text-center text-[#777] mt-1 mb-5">
        Achievements as of 31.03.2026
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 16,
          paddingRight: 30,
        }}
      >
        {dashboardData.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: item.bgColor,
              borderColor: item.borderColor,
            }}
            className="w-[270px] rounded-[28px] border p-5"
          >
            {/* TITLE */}
            <Text
              style={{
                color: item.primaryColor,
              }}
              className="text-center text-[18px] font-spaceSemiBold font-black"
            >
              {item.title}
            </Text>

            {/* PERCENTAGE */}
            <View className="flex-row items-end justify-center mt-3">
              <Text className="text-[28px] font-black text-[#111]">
                {item.percentage}
              </Text>

              <Text className="text-[#555] text-[14px] ml-2 mb-1">
                {item.status}
              </Text>
            </View>

            {/* CHART */}
            <View className="items-center mt-5 h-[180px] justify-center">
              {item.chart}
            </View>

            {/* STATS */}
            <View className="flex-row justify-between mt-4">
              {item.stats.map((stat, idx) => (
                <View
                  key={idx}
                  className="bg-white rounded-2xl px-4 py-3 w-[47%]"
                  style={{
                    elevation: 1,
                  }}
                >
                  <Text
                    style={{
                      color: stat.color,
                    }}
                    className="text-[13px] font-black"
                  >
                    {stat.value}
                  </Text>

                  <Text className="text-[#666] text-[11px] mt-1">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* LEGENDS */}
            <View className="flex-row mt-5">
              {item.legends.map((legend, idx) => (
                <View key={idx} className="flex-row items-center mr-5">
                  <View
                    style={{
                      backgroundColor: legend.color,
                    }}
                    className="w-3 h-3 rounded-full mr-2"
                  />

                  <Text className="text-[#333] text-[13px]">
                    {legend.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default AchievementSection;
