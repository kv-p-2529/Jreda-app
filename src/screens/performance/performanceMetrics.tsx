import React from 'react';
import { SolarSun } from '@/components/SVGIcons';
import { PerfTrend } from './components/PerformanceCard';

// Shared card data for the Performance and Analysis pages — both render the
// same four metrics, so the config lives here in one place. Values are
// hard-coded to the design; swap for an API-driven hook (keyed on the selected
// period / searched applicant) once the backend is live.

export type PerfMetric = {
  key: string;
  icon: string;
  customIcon?: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  accent: string;
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  trend: PerfTrend;
  trendBg: string;
};

export const PERFORMANCE_METRICS: PerfMetric[] = [
  {
    key: 'solar',
    icon: 'custom',
    customIcon: <SolarSun color="#9353F2" width={20} />,
    iconColor: '#9353F2',
    iconBg: '#F3EEFC',
    title: 'Solar Generation KW',
    subtitle: 'KW (Kilowatt)',
    accent: '#7C3AED',
    leftLabel: 'Yesterday',
    leftValue: '0',
    rightLabel: 'Current Month',
    rightValue: '0',
    trend: { direction: 'up', percent: '12%' },
    trendBg: '#F3EEFC',
  },
  {
    key: 'running-hours',
    icon: 'time',
    iconColor: '#F97316',
    iconBg: '#FFF1E6',
    title: 'Running Hours',
    subtitle: 'Hours',
    accent: '#F97316',
    leftLabel: 'Yesterday',
    leftValue: '0',
    rightLabel: 'Current Month',
    rightValue: '0',
    trend: { direction: 'up', percent: '30%' },
    trendBg: '#FFF1E6',
  },
  {
    key: 'water-discharge',
    icon: 'water',
    iconColor: '#1382F5',
    iconBg: '#E6F0FF',
    title: 'Water Discharge LPM',
    subtitle: 'Liter Per Minute',
    accent: '#1382F5',
    leftLabel: 'Yesterday',
    leftValue: '0',
    rightLabel: 'Current Month',
    rightValue: '0',
    trend: { direction: 'down', percent: '10%' },
    trendBg: '#E6F0FF',
  },
  {
    key: 'capacity-utilization',
    icon: 'pie-chart',
    iconColor: '#16A34A',
    iconBg: '#E7F8EC',
    title: 'Capacity Utilization Factor',
    subtitle: 'Percentage',
    accent: '#16A34A',
    leftLabel: 'Till Now',
    leftValue: '0',
    rightLabel: 'Yearly Average',
    rightValue: '0',
    trend: { direction: 'up', percent: '14%' },
    trendBg: '#E7F8EC',
  },
];
