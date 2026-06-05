import React from 'react';
import { View } from 'react-native';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import { Factory, SolarSun } from '@/components/SVGIcons';
import AssetCard, { AssetRow } from './components/AssetCard';

// "Asset Details" page (the Assets tracking tile). Same DashHOC shell, then one
// collapsible AssetCard per equipment category. Values are hard-coded to the
// design; swap to a useAssets() hook keyed on the searched applicant later.

type AssetGroup = {
  key: string;
  title: string;
  icon?: string;
  customIcon?: React.ReactNode;
  accent: string;
  headerBg: string;
  iconBg: string;
  rows: AssetRow[];
};

const MANUFACTURER = 'M/s Solartive Techno Industries Private Limited';

const ASSET_GROUPS: AssetGroup[] = [
  {
    key: 'pump-controller',
    title: 'Pump Controller with RMS',
    icon: 'hardware-chip-outline',
    accent: '#9353F2',
    headerBg: '#F6F1FD',
    iconBg: '#F3EEFC',
    rows: [
      {
        label: 'Manufacturer',
        value: MANUFACTURER,
        icon: 'custom',
        customIcon: <Factory />,
      },
      { label: 'Model Number', value: 'IBIS 2.0', icon: 'cube-outline' },
      { label: 'Serial Number', value: '1234567890', iconText: '#' },
    ],
  },
  {
    key: 'pump',
    title: 'Pump',
    icon: 'hardware-chip-outline',
    accent: '#1382F5',
    headerBg: '#EAF3FE',
    iconBg: '#E6F0FF',
    rows: [
      {
        label: 'Type',
        value: 'HP, DC, Submersible, WaterFilled',
        icon: 'water-outline',
      },
      {
        label: 'Manufacturer',
        value: MANUFACTURER,
        icon: 'custom',
        customIcon: <Factory color="#1382F5" />,
      },
      { label: 'Serial Number', value: '0987654343', iconText: '#' },
      { label: 'Model Number', value: '2SDCS30', icon: 'cube-outline' },
    ],
  },
  {
    key: 'structure',
    title: 'Structure',
    icon: 'git-network-outline',
    accent: '#16A34A',
    headerBg: '#ECFAF0',
    iconBg: '#E7F8EC',
    rows: [
      {
        label: 'Manufacturer',
        value: MANUFACTURER,
        icon: 'custom',
        customIcon: <Factory color="#16A34A" />,
      },
      { label: 'Model Number', value: '4 MMS', icon: 'cube-outline' },
      { label: 'Serial Number', value: '2345678654', iconText: '#' },
    ],
  },
  {
    key: 'solar-panel',
    title: 'Solar Panel',
    customIcon: <SolarSun color="#F43F5E" width={20} />,
    accent: '#F43F5E',
    headerBg: '#FFF0F2',
    iconBg: '#FFE9EC',
    rows: [
      { label: 'SPV - Capacity', value: 'KW', icon: 'flash-outline' },
      {
        label: 'Manufacturer',
        value: 'M/s Icon Solar-EN Technologies Private Limited',
        icon: 'custom',
        customIcon: <Factory color="#F43F5E" />,
      },
      {
        label: 'Serial Number',
        value:
          'NSMP23454454544354 3,NDJHG4495035,MPskdf44540930409 03,NSMPjiek445',
        iconText: '#',
      },
      { label: 'Model Number', value: 'ISEN450', icon: 'cube-outline' },
    ],
  },
];

function AssetDetails() {
  return (
    <DashHOC title="Asset Details">
      <View className="mx-4 mt-6">
        {ASSET_GROUPS.map(({ key, ...group }) => (
          <AssetCard key={key} {...group} />
        ))}
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default AssetDetails;
