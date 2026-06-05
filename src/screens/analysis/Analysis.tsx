import React, { useState } from 'react';
import { View } from 'react-native';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import SegmentedToggle from '@/components/ui/SegmentedToggle';
import PerformanceCard from '@/screens/performance/components/PerformanceCard';
import { PERFORMANCE_METRICS } from '@/screens/performance/performanceMetrics';

// "Analysis" dashboard page. Identical to Performance (same DashHOC shell and
// the same metric cards), with a Current Month / Last Month period toggle above
// the list. The toggle would re-key the data fetch once the API is wired up;
// for now both periods show the same hard-coded design values.

const PERIODS = [
  { label: 'Current Month', value: 'current' },
  { label: 'Last Month', value: 'last' },
];

function Analysis() {
  const [period, setPeriod] = useState('current');

  return (
    <DashHOC title="Analysis">
      <View className="mx-4 mt-6">
        <View className="mb-5">
          <SegmentedToggle
            options={PERIODS}
            value={period}
            onChange={setPeriod}
          />
        </View>

        {PERFORMANCE_METRICS.map(({ key, ...metric }) => (
          <PerformanceCard key={key} {...metric} />
        ))}
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Analysis;
