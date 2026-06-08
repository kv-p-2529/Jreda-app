import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import Button from '@/components/ui/Button';
import SurveyField, { SurveyFieldProps } from './components/SurveyField';

// "Site Survey" tracking page — VIEW ONLY. No search row; a geo card followed by
// the captured survey as read-only icon-labelled fields. Values are seeded to
// the design; point these at the survey record once the API lands.

// The survey body is a flat list of identical icon-labelled fields, so we
// describe them as data and map over it. Grouped here the same way the design
// groups them (identity → meta → location → land → site suitability); replace
// the seeded values with the survey record once the API lands.
const SURVEY_FIELDS: SurveyFieldProps[] = [
  // Applicant identity (plain values)
  { icon: 'person-outline', label: 'Applicant Name', value: 'Agast Panday', variant: 'value' },
  { icon: 'people-outline', label: 'Father / Husband Name', value: 'Lt. Jagdish Panday', variant: 'value' },
  { icon: 'call-outline', label: 'Application Contact No.', value: '7050349878', variant: 'value' },
  // Application meta
  { icon: 'document-text-outline', label: 'Type of Application', value: 'Farmer' },
  { icon: 'grid-outline', label: 'Applicant Category', value: 'General' },
  // Location
  { icon: 'location-outline', label: 'Name of District', value: 'PALAMU' },
  { icon: 'location-outline', label: 'Name of Taluka' },
  { icon: 'location-outline', label: 'Name of Village' },
  { icon: 'location-outline', label: 'Name of Block', value: 'TARHASI' },
  // Land
  {
    icon: 'resize-outline',
    label: 'Land coverage Area',
    subLabel: '(Sq. Meter)',
    placeholder: 'Enter area in sq. meter',
    variant: 'input',
  },
  { icon: 'document-outline', label: 'Khasra No.', placeholder: 'Enter Khasra No.', variant: 'input' },
  { icon: 'document-outline', label: 'Killa No.', placeholder: 'Enter Kill No.', variant: 'input' },
  // Site suitability
  {
    icon: 'sunny-outline',
    label:
      'Is south facing shadow free land available at site for installation of solar pump',
  },
  { icon: 'water-outline', label: 'UGPL/Sprinkler/Drip irrigation installed', value: 'Micro Irrigation' },
  { icon: 'speedometer-outline', label: 'Water Depth Level at site (in ft.)', value: '85 ft.', variant: 'input' },
  { icon: 'water-outline', label: 'Source of Water' },
  { icon: 'ellipse-outline', label: 'Size of Existing bore well (in inches)', value: '12 in.', variant: 'input' },
  { icon: 'flash-outline', label: 'Source of power for existing pump' },
];

function Survey() {
  return (
    <DashHOC title="Site Survey">
      <View className="mx-4 mt-6">
        {/* Geo card */}
        <View
          className="flex-row items-center"
          style={{
            backgroundColor: '#F9FAFE',
            borderWidth: 1,
            borderColor: '#F1F1F2',
            borderRadius: 14,
            padding: 14,
            marginBottom: 18,
          }}
        >
          <Ionicons name="location" size={20} color="#1382F5" />
          <View className="ml-2 flex-1">
            <Text className="text-[14px] text-[#1B1B1B] font-medium">
              Latitude : 23.4099898
            </Text>
            <Text className="text-[14px] text-[#1B1B1B] font-medium mt-1">
              Longitude : 85:3456763
            </Text>
          </View>
          <Ionicons name="locate" size={20} color="#1382F5" />
        </View>

        {SURVEY_FIELDS.map(field => (
          <SurveyField key={field.label} {...field} />
        ))}

        {/* Certification (view-only, shown as confirmed) */}
        <View
          className="flex-row items-start"
          style={{
            backgroundColor: '#F4F9FF',
            borderWidth: 1,
            borderColor: '#D8E6FB',
            borderRadius: 12,
            padding: 12,
            marginTop: 4,
            marginBottom: 16,
          }}
        >
          <Ionicons name="checkbox" size={22} color="#1382F5" />
          <Text className="text-[12px] text-[#1B1B1B] ml-2 flex-1 leading-5">
            It is Certified that we JREDA have inspected the said site on dated
            18/04/2026 and as per site survey, the site is Suitable for
            installation of 2 HP Submersible DC
          </Text>
        </View>

        {/* <Button
          title="Submit Survey"
          onPress={() => {}}
          className="bg-[#1382F5] w-full py-3"
        /> */}
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Survey;
