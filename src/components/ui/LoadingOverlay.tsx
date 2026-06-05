import React from 'react';
import { ActivityIndicator, Modal, Text, View } from 'react-native';

import { shadowMd } from '@/utils/shadows';

// Full-screen blocking loader. Rendered inside a Modal so it sits above
// everything (including the Header) and swallows touches while work is in
// flight. Use for short, indeterminate waits like "fetching data" after a
// submit — pair `visible` with the in-flight flag and pass a `message`.

type Props = {
  visible: boolean;
  message?: string;
};

export default function LoadingOverlay({
  visible,
  message = 'Loading…',
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      >
        <View
          className="items-center justify-center bg-white rounded-2xl px-10 py-7"
          style={shadowMd}
        >
          <ActivityIndicator size="large" color="#1382F5" />
          <Text className="text-[#1B1B1B] text-[15px] font-semibold mt-3">
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
