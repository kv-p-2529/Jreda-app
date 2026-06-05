import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AntDesign from '@react-native-vector-icons/ant-design';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from '@/components/ui/Button';

// "Latest updates" panel — static content for now. The card list is in a
// horizontal-stack-feeling vertical ScrollView with a fixed icon on the left
// (mimics a teletype/marquee layout from the design).
// Replace `updates` with a React Query fetch once the announcements API is in.

const updates = [
  {
    id: 1,
    title: 'प्रिय किसान भाइयों,',
    date: '10 May 2026',
    description:
      'जिन किसानों ने PM-KUSUM Comp-B सोलर पंप सेट योजना के अंतर्गत पंजीकरण कराया है, लेकिन अभी तक लाभार्थी अंशदान का भुगतान नहीं किया है, अथवा जिनको अभी तक आवेदन संख्या (Application Number) प्राप्त नहीं हुई है, उन्हें सूचित किया जाता है कि लाभार्थी अंशदान भुगतान की अंतिम तिथि 31 जनवरी 2026 निर्धारित की गई है',
  },
  {
    id: 2,
    title: 'प्रिय किसान भाइयों,',
    date: '12 May 2026',
    description:
      'PM-KUSUM योजना हेतु आवेदन प्रक्रिया पुनः प्रारंभ कर दी गई है।',
  },
];

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F8FB',
    borderColor: '#E9E9E9',
    borderRadius: 14,
    padding: 10,
    margin: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  heading: {
    fontSize: 24,
    color: '#111111',
  },

  flashIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  contentWrapper: {
    flexDirection: 'row',
    gap: 18,
    maxHeight: 420,
  },

  leftIconWrapper: {
    width: 55,
    height: 55,
    borderRadius: 36,
    backgroundColor: '#EAF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 4,
  },

  badge: {
    backgroundColor: '#0B7CFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },

  dateText: {
    color: '#7C8592',
    fontSize: 15,
    fontWeight: '500',
  },

  description: {
    color: '#5D6674',
    fontSize: 17,
    lineHeight: 30,
    fontWeight: '500',
  },
});
