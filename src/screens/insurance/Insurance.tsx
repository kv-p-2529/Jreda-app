import React from 'react';
import { ImageSourcePropType, View } from 'react-native';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import SearchByCard from '@/screens/dashboard/components/SearchByCard';
import DocumentThumbnail from './components/DocumentThumbnail';
import UploadDropzone from './components/UploadDropzone';

// "Insurance" tracking page. Reuses the DashHOC shell, but its search is a
// single "Insurance Number" lookup (no Application/Mobile radio), followed by a
// grid of uploaded policy documents and an upload drop-zone.
//
// Documents are hard-coded to the design (sample images stand in for the real
// monitoring photos); swap to a useInsuranceDocs() hook keyed on the searched
// policy number once the backend is live.

type PolicyDoc = {
  key: string;
  image: ImageSourcePropType;
  name: string;
  type: string;
  size: string;
};

const POLICY_DOCS: PolicyDoc[] = [
  {
    key: 'doc-1',
    image: require('@assets/service1.jpg'),
    name: 'Monitoring_1988e9w8jhddsffjh...',
    type: 'JPG',
    size: '2.5 MB',
  },
  {
    key: 'doc-2',
    image: require('@assets/service2.jpg'),
    name: 'Monitoring_1988e9w8jhddsffjh...',
    type: 'JPG',
    size: '2.5 MB',
  },
  {
    key: 'doc-3',
    image: require('@assets/service3.jpg'),
    name: 'Monitoring_1988e9w8jhddsffjh...',
    type: 'JPG',
    size: '2.5 MB',
  },
];

function Insurance() {
  return (
    <DashHOC title="Insurance">
      <SearchByCard
        label="Insurance Number"
        options={[]}
        defaultQuery="INS-20240-00125"
        placeholder="Enter Insurance Number"
        onSearch={() => {}}
      />

      <View className="mx-4 mt-6">
        {/* Document grid — two columns */}
        <View className="flex-row flex-wrap justify-between">
          {POLICY_DOCS.map(doc => (
            <View key={doc.key} style={{ width: '48%', marginBottom: 14 }}>
              <DocumentThumbnail
                image={doc.image}
                name={doc.name}
                type={doc.type}
                size={doc.size}
                onDownload={() => {}}
              />
            </View>
          ))}
        </View>

        <Spacer size="sm" />
        <UploadDropzone onPress={() => {}} />
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Insurance;
