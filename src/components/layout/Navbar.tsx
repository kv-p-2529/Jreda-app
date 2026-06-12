import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import jredaLogo from '@assets/logo.png';
import hamburgerIcon from '@assets/hamburger.png';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/services/baseService';

interface NavbarProps {
  isDrawerOpen: boolean;
  onHamburgerPress: () => void;
}

// Memoized — sits at the top of every screen via AppLayout. Without memo it
// re-renders on every navigation since the parent's props churn.
const Navbar = React.memo(({ isDrawerOpen, onHamburgerPress }: NavbarProps) => {
  const { navigate } = useNavigation<any>();
  const { isAuthenticated } = useAuth();

  // Logo tap routes by auth state: logged-in users go to their Dashboard,
  // visitors land on the marketing Home.
  const goHome = () => {
    navigate(isAuthenticated ? 'Dashboard' : 'Home');
  };

  return (
    <View
      pointerEvents="box-none"
      className="h-[500px] w-full absolute z-50 top-0 right-0 left-0"
    >
      <View
        style={{ backgroundColor: '#00000040' }}
        className="px-2 py-4 left-0 flex-row items-center justify-between"
      >
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <View className="flex-row items-center gap-3 flex-1">
          <TouchableOpacity onPress={goHome}>
            <Image
              source={jredaLogo}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View className="ml-2 flex-shrink">
            <Text className="text-white font-bold leading-tight">
              Jharkhand Renewable Energy Development Agency
            </Text>
            <Text className="text-[#7DFF73] text-xs mt-1 font-medium">
              State Govt Agency under Department of Energy
            </Text>
          </View>
        </View>

        {isAuthenticated && (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={onHamburgerPress} activeOpacity={0.8}>
              <Image source={hamburgerIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  logo: {
    width: 65,
    height: 65,
  },
});

export default Navbar;
