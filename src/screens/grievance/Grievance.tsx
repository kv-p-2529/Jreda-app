import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import SearchByCard from '@/screens/dashboard/components/SearchByCard';
import StatCard from '@/screens/jcr/components/StatCard';

// The Grievance tracking tile opens the complaints register. DashHOC shell +
// Search row, a horizontally-scrolling Open/Close/Total summary, then the
// open-complaints list (currently an empty state). Counts are hard-coded; wire
// to a useComplaints() hook keyed on the searched applicant.

const STATS = [
  {
    key: 'open',
    icon: 'document-text-outline',
    accent: '#EF4444',
    bg: '#FEF2F2',
    value: '0',
    label: 'Open',
  },
  {
    key: 'close',
    icon: 'clipboard-outline',
    accent: '#16A34A',
    bg: '#ECFAF0',
    value: '0',
    label: 'Close',
  },
  {
    key: 'total',
    icon: 'document-text-outline',
    accent: '#64748B',
    bg: '#F1F5F9',
    value: '0',
    label: 'Total',
  },
];

function Grievance() {
  const navigation = useNavigation<any>();

  return (
    <DashHOC title="Grievance">
      <SearchByCard
        label="Search By:"
        options={[
          { label: 'Application No', value: 'application' },
          { label: 'Mobile No', value: 'mobile' },
        ]}
        defaultOption="application"
        defaultQuery="JH0320221060"
        placeholder="Enter Application No"
        onSearch={() => {}}
      />

      {/* Summary cards — horizontal scroll, next card peeks in */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          gap: 12,
        }}
      >
        {STATS.map(s => (
          <StatCard
            key={s.key}
            icon={s.icon}
            accent={s.accent}
            bg={s.bg}
            value={s.value}
            label={s.label}
          />
        ))}
      </ScrollView>

      <View className="mx-4 mt-6">
        <Text className="text-[18px] font-spaceBold text-[#1B1B1B] mb-3">
          Open Complaints
        </Text>

        {/* Empty state */}
        <View className="items-center py-6">
          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: '#FFF6EC',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="document-text-outline" size={52} color="#F4A64B" />
          </View>
          <Text className="text-[17px] font-bold text-[#1B1B1B] mt-5">
            No Complaint Record Found
          </Text>
          <Text className="text-[13px] text-[#8A8A8A] mt-1 text-center">
            You're all set! There are no open complaints.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddComplaint')}
            className="flex-row items-center justify-center mt-5"
            style={{
              borderWidth: 1.5,
              borderColor: '#F59E0B',
              borderRadius: 999,
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <Ionicons name="add-circle" size={20} color="#F97316" />
            <Text
              className="text-[15px] font-semibold ml-2"
              style={{ color: '#F97316' }}
            >
              Add Complaint
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Grievance;
