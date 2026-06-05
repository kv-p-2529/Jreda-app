import React, { useCallback, useRef, useState } from 'react';
import { Animated } from 'react-native';
import Backdrop from './Backdrop';
import DrawerMenu from './DrawerMenu';
import Navbar from './Navbar';
import { DRAWER_WIDTH } from './layoutConstants';
import LinearGradient from 'react-native-linear-gradient';
import AppModal from '../AppModal';
import LoginScreen from '@/screens/auth/LoginScreen';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Persistent chrome that wraps every screen: gradient background, navbar at
// top, slide-in drawer from the right, and a login modal triggered from the
// drawer's "Apply online" button.
//
// Drawer animation:
//   - translateX moves the drawer from off-screen-right (DRAWER_WIDTH) to 0
//   - backdropOpacity fades the dim layer in alongside it
//   - useRef + Animated.Value avoids React state churn on every animation frame
const AppLayout = ({ children }: AppLayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Start off-screen — initial translateX of DRAWER_WIDTH means the drawer is
  // parked just to the right of the viewport edge.
  const drawerTranslateX = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openDrawer = useCallback(() => {
    // Flip the React flag first so the backdrop mounts, THEN animate. If we
    // reversed the order the backdrop wouldn't catch the opacity transition.
    setIsDrawerOpen(true);
    Animated.parallel([
      Animated.spring(drawerTranslateX, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.55,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, drawerTranslateX]);

  const closeDrawer = useCallback(() => {
    Animated.parallel([
      Animated.spring(drawerTranslateX, {
        toValue: DRAWER_WIDTH,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      // Unmount the backdrop only AFTER the animation finishes — otherwise the
      // backdrop pops out instantly while the drawer is still sliding away.
    ]).start(() => setIsDrawerOpen(false));
  }, [backdropOpacity, drawerTranslateX]);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  // After a successful login (or modal dismiss) close both the modal and the
  // drawer, so the user lands on a clean Dashboard.
  const handleLoginClose = useCallback(() => {
    closeLogin();
    closeDrawer();
  }, [closeLogin, closeDrawer]);

  return (
    <>
      <LinearGradient
        colors={['#055096', '#ffffff', '#ffffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <Navbar onHamburgerPress={openDrawer} isDrawerOpen={isDrawerOpen} />
        {children}

        {/* Backdrop is only mounted while the drawer is open — saves a layer
            on every screen the rest of the time. */}
        {isDrawerOpen && (
          <Backdrop opacity={backdropOpacity} onPress={closeDrawer} />
        )}

        <DrawerMenu
          translateX={drawerTranslateX}
          onClose={closeDrawer}
          onApplyOnline={openLogin}
        />
      </LinearGradient>

      <AppModal onClose={closeLogin} visible={isLoginOpen}>
        <LoginScreen
        // closeModal={handleLoginClose} 
        />
      </AppModal>
    </>
  );
};

export default AppLayout;
