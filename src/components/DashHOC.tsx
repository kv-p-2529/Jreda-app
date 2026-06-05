import FarmerDetailsCard, {
  FarmerDetails,
} from '@/screens/dashboard/components/FarmerDetailsCard';
import SearchByCard from '@/screens/dashboard/components/SearchByCard';
import React from 'react';
import { Text, View } from 'react-native';
import { shadowXs } from '@/utils/shadows';

// Higher-order wrapper for dashboard pages. Renders the Farmer Details card
// + the User Dashboard search row, then drops children below — so each
// dashboard variant just supplies the body-specific content.
//
// FARMER is hard-coded for now. When the API lands, lift this into a hook
// (e.g. useCurrentFarmer) that pulls from React Query.

const FARMER: FarmerDetails = {
  name: 'Agast Panday',
  fatherName: 'Lt. Jagdish Panday',
  applicationId: 'KUSUM-2026-0123',
  pumpInfo: '2 HP DC Submersible',
  mobile: '70998 34568',
  location: 'Palamu, JH',
  company: 'Solartive Techno Industries Private Limited',
};

function DashHOC({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    // marginTop:90 clears the absolute-positioned navbar that sits above.
    // If you change the navbar height, this value needs to track it.
    <View style={{ backgroundColor: 'transparent', marginTop: 90 }}>
      <FarmerDetailsCard farmer={FARMER} onEdit={() => {}} />

      <View
        style={{
          borderColor: '#F1F1F2',
          borderRadius: 16,
          backgroundColor: 'white',
          margin: 16,
          ...shadowXs,
        }}
      >
        <Text
          style={{ paddingHorizontal: 16, paddingTop: 10 }}
          className="text-[22px] font-spaceBold text-[#1B1B1B]"
        >
          {title}
        </Text>

        {/* <SearchByCard
          label="Search By:"
          options={[
            { label: 'Application No', value: 'application' },
            { label: 'Mobile No', value: 'mobile' },
          ]}
          defaultOption="application"
          defaultQuery="JH0320221060"
          placeholder="Enter Application No"
          onSearch={() => {}}
        /> */}

        {children}
      </View>
    </View>
  );
}

export default DashHOC;
