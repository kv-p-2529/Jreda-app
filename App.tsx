// PMKUSUM root component. Order of providers matters:
//   initAuth (hydrates token from AsyncStorage) -> SafeArea -> Navigation
//   -> AppLayout (drawer + navbar) -> screens
// Don't reorder without thinking — auth state has to exist before navigation
// reads it (AppNavigator picks the initial route based on isAuthenticated).

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

// NativeWind v4 — compiled Tailwind output that injects atomic className styles.
import './global.css';

import AppNavigator from './src/navigation/AppNavigator';
import AppLayout from './src/components/layout/AppLayout';
import ToastHost from './src/components/ui/Toast';
import { initAuth } from './src/services/baseService';

// Navigation theme override — we render our own gradient background in
// AppLayout, so the navigator's background needs to be transparent or it'll
// paint over us.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const styles = StyleSheet.create({
  persistLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default function App() {
  // Hydrate the auth token from storage before rendering, so AppNavigator can
  // read it synchronously (via useAuth) to pick its initial route.
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initAuth().finally(() => setAuthReady(true));
  }, []);

  if (!authReady) {
    return (
      <View style={styles.persistLoading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        {/* barStyle controls the icon/text color (dark-content = black).
                  On RN 0.85 Android edge-to-edge the backgroundColor prop is
                  ignored, so the white bar background is painted by the
                  SafeAreaView below instead. */}
        <StatusBar barStyle={'dark-content'} />
        <SafeAreaView style={{ flexGrow: 1, backgroundColor: '#ffffff' }}>
          <AppLayout>
            <AppNavigator />
          </AppLayout>
          {/* Overlays the whole app; absolutely positioned + non-
                    interactive, so it sits above everything without affecting
                    layout. Drives the iOS/non-Android toast from showToast. */}
          <ToastHost />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
