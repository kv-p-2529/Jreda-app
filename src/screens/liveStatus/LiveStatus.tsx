import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import CalendarModal, {
  formatDisplay,
  toISO,
} from '@/components/ui/CalendarModal';
import LiveMetricCard from './components/LiveMetricCard';
import GeolocationCard from './components/GeolocationCard';
import { LIVE_METRICS, TODAY_METRICS } from './liveStatusMetrics';

// "Live Status" dashboard page. Reuses DashHOC (Farmer card + title + Search
// row), then lays out the live telemetry cards below it. The hard-coded metric
// data lives in liveStatusMetrics.tsx.

function LiveStatus() {
  // Selected day for "Today's Parameters". Defaults to today; future dates are
  // disabled since you can't have parameters for a day that hasn't happened.
  const [paramDate, setParamDate] = useState(() => toISO(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <DashHOC title="Live Status">
      <View className="mx-4 mt-6">
        {LIVE_METRICS.map(({ key, ...metric }) => (
          <LiveMetricCard key={key} {...metric} />
        ))}

        <GeolocationCard onOpenMap={() => {}} />

        {/* Today's Parameters header + date selector */}
        <View className="flex-row items-center justify-between mt-2 mb-3">
          <Text className="text-[18px] font-spaceBold text-[#1B1B1B]">
            Today's Parameters
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCalendarOpen(true)}
            className="flex-row items-center"
            style={{
              borderWidth: 1,
              borderColor: '#D8E6FB',
              backgroundColor: '#F4F9FF',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 7,
            }}
          >
            <Ionicons name="calendar-outline" size={15} color="#1382F5" />
            <Text className="text-[13px] text-[#1382F5] font-semibold mx-1.5">
              {formatDisplay(paramDate)}
            </Text>
            <Ionicons name="chevron-down" size={15} color="#1382F5" />
          </TouchableOpacity>
        </View>

        {TODAY_METRICS.map(({ key, ...metric }) => (
          <LiveMetricCard key={key} {...metric} />
        ))}
      </View>
      <Spacer size="lg" />

      <CalendarModal
        visible={calendarOpen}
        value={paramDate}
        maximumDate={new Date()}
        onClose={() => setCalendarOpen(false)}
        onSelect={iso => {
          setParamDate(iso);
          setCalendarOpen(false);
        }}
      />
    </DashHOC>
  );
}

export default LiveStatus;
