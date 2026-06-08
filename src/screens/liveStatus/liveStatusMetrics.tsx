import React from 'react';

import { MetricTrend } from './components/LiveMetricCard';
import { HandPump, SolarSun } from '@/components/SVGIcons';

// Hard-coded live-telemetry data backing the Live Status page. Swap to a
// useLiveStatus() React Query hook keyed on the searched application/mobile
// number once the telemetry API is wired up.

export type Metric = {
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
export const LIVE_METRICS: Metric[] = [
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
export const TODAY_METRICS: Metric[] = [
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
