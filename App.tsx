// PMKUSUM root component. Order of providers matters:
//   Redux store -> PersistGate (hydrates from AsyncStorage) -> React Query
//   -> SafeArea -> Navigation -> AppLayout (drawer + navbar) -> screens
// Don't reorder without thinking — auth state has to exist before navigation
// reads it (AppNavigator picks the initial route based on isAuthenticated).

import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

// NativeWind v4 — compiled Tailwind output that injects atomic className styles.
import './global.css';

import { store, persistor } from './src/store/store';
import { queryClient } from './src/services/queryClient';
import AppNavigator from './src/navigation/AppNavigator';
import AppLayout from './src/components/layout/AppLayout';
import ToastHost from './src/components/ui/Toast';

// Brief spinner while redux-persist rehydrates the stored auth token from
// AsyncStorage. Memoized because PersistGate may render it more than once.
const PersistLoading = React.memo(() => (
  <View style={styles.persistLoading}>
    <ActivityIndicator size="large" color="#16a34a" />
  </View>
));

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
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <StoreProvider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer theme={navTheme}>
              {/* barStyle controls the icon/text color (dark-content = black).
                  On RN 0.85 Android edge-to-edge the backgroundColor prop is
                  ignored, so the white bar background is painted by the
                  SafeAreaView below instead. */}
              <StatusBar barStyle={'dark-content'} />
              <SafeAreaView
                style={{ flexGrow: 1, backgroundColor: '#ffffff' }}
              >
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
        </QueryClientProvider>
      </PersistGate>
    </StoreProvider>
  );
}
