import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Button from './ui/Button';

// Reusable status modal used for "Payment success", "Registration success",
// error states, info splashes, etc. The four themes share one shape so the
// caller doesn't have to repeat icon-color-bg trios every time.

export type StatusType = 'success' | 'error' | 'info' | 'warning';

interface SuccessScreenProps {
  visible?: boolean;
  onClose?: () => void;
  type?: StatusType;
  title?: string;
  subtitle?: string;
  extraContent?: React.ReactNode;
  buttonTitle?: string;
  onButtonPress?: () => void;
  className?: string;
}

// Theme tokens kept at module scope (not inside the component) so they aren't
// rebuilt on every render. The defaults double as fallbacks when caller
// doesn't pass title/subtitle.
const THEMES = {
  success: {
    primaryColor: '#22C55E',
    bgColor: '#DCFCE7',
    iconName: 'checkmark-outline',
    defaultTitle: 'Success!',
    defaultSubtitle: 'Your action was completed successfully.',
  },
  error: {
    primaryColor: '#EF4444',
    bgColor: '#FEE2E2',
    iconName: 'close-outline',
    defaultTitle: 'Error!',
    defaultSubtitle: 'Something went wrong. Please try again.',
  },
  warning: {
    primaryColor: '#F59E0B',
    bgColor: '#FEF3C7',
    iconName: 'warning-outline',
    defaultTitle: 'Warning!',
    defaultSubtitle: 'Please review before proceeding.',
  },
  info: {
    primaryColor: '#3B82F6',
    bgColor: '#DBEAFE',
    iconName: 'information-outline',
    defaultTitle: 'Information',
    defaultSubtitle: 'Here is some helpful information.',
  },
} as const;

export default function SuccessScreen({
  visible = true,
  onClose,
  type = 'success',
  title,
  subtitle,
  extraContent,
  buttonTitle = 'Done',
  onButtonPress,
  className = '',
}: SuccessScreenProps) {
  const theme = THEMES[type];
  const displayTitle = title ?? theme.defaultTitle;
  const displaySubtitle = subtitle ?? theme.defaultSubtitle;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.cardContainer} className={className}>
              {/* Themed status disc — color comes entirely from the theme so
                  visual hierarchy is consistent across success/error/info. */}
              <View
                style={{ backgroundColor: theme.bgColor }}
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
              >
                <Ionicons
                  name={theme.iconName}
                  size={48}
                  color={theme.primaryColor}
                />
              </View>

              <Text className="text-3xl font-extrabold text-[#111111] mb-3 text-center">
                {displayTitle}
              </Text>

              <Text className="text-base text-gray-500 text-center mb-6 leading-relaxed px-2">
                {displaySubtitle}
              </Text>

              {/* Optional slot for receipt rows / order numbers / extra info */}
              {extraContent && (
                <>
                  <View className="w-full h-[1px] bg-gray-100 mb-6" />
                  <View className="w-full items-center mb-6">
                    {extraContent}
                  </View>
                </>
              )}

              <Button
                title={buttonTitle}
                onPress={() => {
                  // Fire the explicit handler if provided, then always close.
                  // Closing is treated as the default acknowledgment so callers
                  // don't have to remember both.
                  if (onButtonPress) onButtonPress();
                  if (onClose) onClose();
                }}
                className="w-full bg-[#1683F2] py-4"
                textClassName="text-base font-bold text-white"
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Darker than the standard 50% overlay — design wanted the success card to
  // feel ceremonious, like a "premium" confirmation.
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    width: '100%',
    maxWidth: 360,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
});
