import React from 'react';
import { View } from 'react-native';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import SearchByCard from '@/screens/dashboard/components/SearchByCard';
import ChecklistTable from './components/ChecklistTable';
import VerdictCard from './components/VerdictCard';
import { CHECKLIST, VERDICT } from './inspectionData';

// "Site Inspection" tracking page — VIEW ONLY. The standard DashHOC shell +
// Search row, a checklist table showing captured answers, then the verification
// date / verdict / submit block. All values are read straight from the
// (currently hard-coded) inspection record in inspectionData.tsx.

function Inspection() {
  return (
    <DashHOC title="Site Inspection">
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

      <View className="mx-4 mt-6">
        <ChecklistTable items={CHECKLIST} />

        <Spacer size="md" />

        <VerdictCard verificationDate="13-09-2025" verdict={VERDICT} />
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Inspection;
