import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

// "Achievement Dashboard" — horizontal carousel of donut charts, one per
// program component. Each card carries:
//   - its own color theme (primary, bg, border)
//   - a PieChart with hardcoded stats (replace with API data once available)
//   - text stats below, plus a legend
//
// The four cards share structure but each PieChart has subtle variations
// (showText, focusOnPress, raw counts vs. percentages) — that's why the
// chart is baked into the data, not derived. Don't try to "DRY" it without
// preserving those per-card differences.

const dashboardData = [
  {
    title: 'Component A',
    percentage: '10.5%',
    status: 'Installed',
    primaryColor: '#00B312',
    bgColor: '#F3F8F2',
    borderColor: '#00B312',

    chart: (
      <PieChart
        donut
        radius={72}
        innerRadius={38}
        data={[
          {
            value: 10.5,
            color: '#00B312',
          },
          {
            value: 89.5,
            color: '#F78F8A',
          },
        ]}
        centerLabelComponent={() => <View />}
      />
    ),

    stats: [
      {
        value: '10,000.00',
        label: 'Sanctioned MW',
        color: '#F78F8A',
      },
      {
        value: '1,052.95',
        label: 'Installed MW',
        color: '#00B312',
      },
    ],

    legends: [
      {
        label: 'Sanctioned',
        color: '#F78F8A',
      },
      {
        label: 'Installed',
        color: '#00B312',
      },
    ],
  },

  {
    title: 'Component B',
    percentage: '80.0%',
    status: 'Installed',
    primaryColor: '#5327B8',
    bgColor: '#F7F4FD',
    borderColor: '#B57CFF',

    chart: (
      <PieChart
        donut
        radius={72}
        innerRadius={38}
        showText
        textColor="white"
        textSize={16}
        focusOnPress
        data={[
          {
            value: 80,
            color: '#5327B8',
            text: '80%',
          },
          {
            value: 20,
            color: '#F78F8A',
            text: '20%',
          },
        ]}
      />
    ),

    stats: [
      {
        value: '13,30,190',
        label: 'Sanctioned Nos.',
        color: '#F78F8A',
      },
      {
        value: '10,64,515',
        label: 'Installed Nos.',
        color: '#5327B8',
      },
    ],

    legends: [
      {
        label: 'Sanctioned',
        color: '#F78F8A',
      },
      {
        label: 'Installed',
        color: '#5327B8',
      },
    ],
  },

  {
    title: 'Component C (IPS)',
    percentage: '26.7%',
    status: 'Solarised',
    primaryColor: '#0075FF',
    bgColor: '#F5FAFF',
    borderColor: '#5CA3FF',

    chart: (
      <PieChart
        donut
        radius={72}
        innerRadius={38}
        data={[
          {
            value: 55392,
            color: '#FF7D7D',
          },
          {
            value: 14806,
            color: '#0075FF',
          },
        ]}
      />
    ),

    stats: [
      {
        value: '55,392',
        label: 'Sanctioned',
        color: '#FF7D7D',
      },
      {
        value: '14,806',
        label: 'Solarised',
        color: '#0075FF',
      },
    ],

    legends: [
      {
        label: 'Sanctioned',
        color: '#FF7D7D',
      },
      {
        label: 'Solarised',
        color: '#0075FF',
      },
    ],
  },

  {
    title: 'Component C (FLS)',
    percentage: '40.5%',
    status: 'Solarised',
    primaryColor: '#FF6A00',
    bgColor: '#FFF8F3',
    borderColor: '#FFB06F',

    chart: (
      <PieChart
        donut
        radius={72}
        innerRadius={38}
        data={[
          {
            value: 40.5,
            color: '#FF6A00',
          },
          {
            value: 59.5,
            color: '#F78F8A',
          },
        ]}
      />
    ),

    stats: [
      {
        value: '35,13,602',
        label: 'Sanctioned',
        color: '#F78F8A',
      },
      {
        value: '14,24,609',
        label: 'Solarised',
        color: '#FF6A00',
      },
    ],

    legends: [
      {
        label: 'Sanctioned',
        color: '#F78F8A',
      },
      {
        label: 'Solarised',
        color: '#FF6A00',
      },
    ],
  },
];

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
