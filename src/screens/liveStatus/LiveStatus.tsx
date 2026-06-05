import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import CalendarModal, {
  formatDisplay,
  toISO,
} from '@/components/ui/CalendarModal';
import LiveMetricCard, { MetricTrend } from './components/LiveMetricCard';
import GeolocationCard from './components/GeolocationCard';
import { HandPump, SolarSun } from '@/components/SVGIcons';

// "Live Status" dashboard page. Reuses DashHOC (Farmer card + title + Search
// row), then lays out the live telemetry cards below it.
//
// Values are hard-coded to match the design for now; swap to a useLiveStatus()
// React Query hook keyed on the searched application/mobile number once the
// telemetry API is wired up.

type Metric = {
  key: string;
  icon: string;
  customIcon?: React.ReactNode; // optional custom SVG/JSX icon
  iconColor: string;
  iconBg: string;
  title: string;
  value: string;
  unit: string;
  accent: string;
  trend: MetricTrend;
  trendBg: string;
};

// Top group — instantaneous readings shown above "Today's Parameters".
const LIVE_METRICS: Metric[] = [
  {
    key: 'solar',
    icon: 'custom',
    customIcon: <SolarSun color="#9353F2" width={20} />,
    iconColor: '#9353F2',
    iconBg: '#F3EEFC',
    title: 'Solar Generation',
    value: '2 KW',
    unit: 'KW (Kilowatt)',
    accent: '#7C3AED',
    trend: { direction: 'up', percent: '12%' },
    trendBg: '#F3EEFC',
  },
  {
    key: 'water-flow',
    icon: 'custom',
    customIcon: <HandPump />,
    iconColor: '#F43F5E',
    iconBg: '#FFE9EC',
    title: 'Water Discharge Flow Rate',
    value: '200L',
    unit: 'LPM (Liter Per Minute)',
    accent: '#F43F5E',
    trend: { direction: 'up', percent: '30%' },
    trendBg: '#FFE9EC',
  },
];

// Bottom group — today's cumulative parameters, shown under the date header.
const TODAY_METRICS: Metric[] = [
  {
    key: 'runtime',
    icon: 'time',
    iconColor: '#F97316',
    iconBg: '#FFF1E6',
    title: "Today's Runtime",
    value: '05:45',
    unit: 'HH:MM (Hours : Minutes)',
    accent: '#F97316',
    trend: { direction: 'down', percent: '25%' },
    trendBg: '#FFF1E6',
  },
  {
    key: 'energy',
    icon: 'flash',
    iconColor: '#16A34A',
    iconBg: '#E7F8EC',
    title: "Today's Energy",
    value: '12.45',
    unit: 'HH:MM (Hours : Minutes)',
    accent: '#16A34A',
    trend: { direction: 'up', percent: '10%' },
    trendBg: '#E7F8EC',
  },
  {
    key: 'water-discharge',
    icon: 'water',
    iconColor: '#1382F5',
    iconBg: '#E6F0FF',
    title: "Today's Water Discharge",
    value: '23,450',
    unit: 'Liters',
    accent: '#1382F5',
    trend: { direction: 'down', percent: '10%' },
    trendBg: '#E6F0FF',
  },
];

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
