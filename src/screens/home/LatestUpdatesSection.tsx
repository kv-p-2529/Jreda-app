import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import AntDesign from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from '@/components/ui/Button';

import { updates } from './latestUpdatesData';
import { styles } from './latestUpdatesStyles';

// "Latest updates" panel — static content for now. The card list is in a
// horizontal-stack-feeling vertical ScrollView with a fixed icon on the left
// (mimics a teletype/marquee layout from the design). Data + styles live in
// latestUpdatesData.ts / latestUpdatesStyles.ts.

export default function LatestUpdates() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text className="font-spaceSemiBold" style={styles.heading}>
          LATEST UPDATES
        </Text>

        <View style={styles.flashIcon}>
          <Ionicons name="flash-outline" size={26} color="#0B7CFF" />
        </View>
      </View>

      <View style={styles.contentWrapper}>
        {/* Fixed Left Icon */}
        <View style={styles.leftIconWrapper}>
          <AntDesign name="notification" size={32} color="#0B7CFF" />
        </View>

        {/* Scrollable Cards */}
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 18,
            paddingBottom: 20,
          }}
        >
          {updates.map(item => (
            <View key={item.id} style={styles.card}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4,
                }}
              >
                {/* Badge */}
                <Button
                  title="Update"
                  size="sm"
                  style={{ borderRadius: 10, height: 30 }}
                />

                {/* Title */}
                <Text style={styles.cardTitle}>“{item.title}</Text>
              </View>

              {/* Date */}
              <View style={styles.dateRow}>
                <Ionicons name="time-outline" size={18} color="#7C8592" />

                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              {/* Description */}
              <Text style={styles.description}>{item.description}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
