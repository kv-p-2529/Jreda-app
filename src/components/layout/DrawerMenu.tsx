import React, { useMemo } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { DRAWER_WIDTH, NAV_ITEMS } from './layoutConstants';
import logo2 from '@assets/logo-2.png';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

interface DrawerMenuProps {
  translateX: Animated.Value;
  onApplyOnline: () => void;
  onClose: () => void;
}

// Slide-in side drawer. Receives an animated translateX from AppLayout so the
// open/close animation is driven by the parent — keeps both the drawer and
// its backdrop in sync.
const DrawerMenu = React.memo(
  ({ translateX, onClose, onApplyOnline }: DrawerMenuProps) => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(
      state => state.auth.isAuthenticated,
    );

    // Memoized so we don't allocate a new style array on every parent render —
    // matters because the parent updates its Animated.Value frequently.
    const drawerStyle = useMemo(
      () => [styles.drawer, { transform: [{ translateX }] }],
      [translateX],
    );

    // Log out and close the drawer — there's no good "logged out but drawer
    // still open" state to land on, so collapse both at once.
    const handleLogout = () => {
      dispatch(logout());
      onClose();
    };

    return (
      <Animated.View
        className="absolute top-0 right-0 bottom-0 bg-gray-950 z-50"
        style={drawerStyle}
      >
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 right-4 w-9 h-9 items-center justify-center z-10"
          activeOpacity={0.7}
        >
          <Text className="text-white text-2xl">x</Text>
        </TouchableOpacity>

        <ScrollView
          className="flex-1 pt-16"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-2 pb-4">
            {NAV_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                className={`px-5 py-4 rounded-lg mb-1 flex-row items-center gap-3 ${
                  index === 0 ? 'bg-white' : ''
                }`}
                activeOpacity={0.7}
              >
                <View className="w-7 h-7 rounded-full bg-green-700 items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">
                    {item.icon}
                  </Text>
                </View>
                <Text
                  className={`text-base font-medium ${
                    index === 0 ? 'text-gray-900' : 'text-white'
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="h-px bg-gray-700 mx-5 mb-5" />

          <View className="px-5 pb-6">
            <Button
              title={isAuthenticated ? 'Log out' : 'Apply online'}
              onPress={isAuthenticated ? handleLogout : onApplyOnline}
              className={`${
                isAuthenticated ? 'bg-red-600' : 'bg-green-600'
              } h-14`}
              textClassName="text-base tracking-wide"
            />
          </View>

          <View className="px-5 pb-8 items-center gap-1">
            <Image source={logo2} style={{ height: 60 }} resizeMode="contain" />
          </View>
        </ScrollView>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  drawer: {
    width: DRAWER_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,
  },
});

export default DrawerMenu;
