import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import Spacer from '@/components/ui/Spacer';
import { shadowSm } from '@/utils/shadows';
import PaymentReceipt, { ReceiptData } from '@/pdfs/PaymentReceipt';
import { downloadReceiptPdf } from '@/pdfs/downloadReceipt';
import { RootStackParamList } from '@/navigation/AppNavigator';

// Standalone receipt viewer reached from the registration "Download Receipt"
// action. Renders the on-screen replica and offers a PDF export (share/save)
// of the very same layout.

function ReceiptScreen() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'Receipt'>>();
  const data = params.data as ReceiptData;
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    await downloadReceiptPdf(data);
    setDownloading(false);
  };

  return (
    <View style={{ marginTop: 90, marginHorizontal: 16 }}>
      {/* Top bar */}
      <View className="flex-row items-center mb-4">
        <Text className="text-[20px] font-spaceBold text-[#1B1B1B] ml-3">
          Payment Receipt
        </Text>
      </View>

      {/* Receipt card */}
      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{ borderWidth: 1, borderColor: '#EEF1F4', ...shadowSm }}
      >
        <PaymentReceipt data={data} />
      </View>

      <View className="mt-5">
        <Button
          title={downloading ? 'Preparing…' : 'Download Receipt'}
          onPress={onDownload}
          loading={downloading}
          leftIcon={
            !downloading ? (
              <Ionicons name="download-outline" size={20} color="#fff" />
            ) : undefined
          }
          className="bg-[#1382F5] py-3"
          textClassName="text-[16px]"
        />
      </View>

      <Spacer size="lg" />
    </View>
  );
}

export default ReceiptScreen;
