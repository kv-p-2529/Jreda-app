import React from 'react';
import { Modal, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// Shared fullscreen overlay for the social/video section. Tapping the dark
// backdrop (or the close button) calls onClose; children render centered on
// top of it. Children that should NOT dismiss on tap (e.g. video controls)
// must wrap themselves in a Pressable that stops propagation.

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function FullscreenMediaModal({ visible, onClose, children }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/90 items-center justify-center"
      >
        {children}

        <TouchableOpacity
          onPress={onClose}
          className="absolute top-12 right-6 w-12 h-12 rounded-full bg-white/95 items-center justify-center"
        >
          <Ionicons name="close" size={26} color="#1B1B1B" />
        </TouchableOpacity>
      </Pressable>
    </Modal>
  );
}

export default FullscreenMediaModal;
