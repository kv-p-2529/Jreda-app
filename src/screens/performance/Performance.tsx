import React from 'react';
import { View } from 'react-native';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import PerformanceCard from './components/PerformanceCard';
import { PERFORMANCE_METRICS } from './performanceMetrics';

// "Performance" dashboard page. Same DashHOC shell as Live Status (Farmer card
// + title + Search row), then the shared performance summary cards comparing a
// short window (Yesterday) against a longer one (Current Month / Yearly Average).

function Performance() {
  return (
    <DashHOC title="Performance">
      <View className="mx-4 mt-6">
        {PERFORMANCE_METRICS.map(({ key, ...metric }) => (
          <PerformanceCard key={key} {...metric} />
        ))}
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Performance;
