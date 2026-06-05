import React, { useCallback, useMemo, lazy } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/store';
import Footer from '@/components/layout/Footer';

// Typed routes — the source of truth for navigation params. Add a new route
// here first, then `navigate('NewRoute')` becomes type-checked everywhere.
export type RootStackParamList = {
  // Home?: undefined;
  Dashboard: undefined;
  LiveStatus: undefined;
  Performance: undefined;
  Analysis: undefined;
  Assets: undefined;
  Insurance: undefined;
  Inspection: undefined;
  Survey: undefined;
  JCR: undefined;
  Register: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screens are lazy-loaded so the initial JS bundle stays lean — the register
// flow and dashboard chunks only load when the user navigates to them.
const Dashboard = React.lazy(() => import('@screens/dashboard/Dashboard'));
const LiveStatus = React.lazy(() => import('@/screens/liveStatus/LiveStatus'));
const Performance = React.lazy(
  () => import('@/screens/performance/Performance'),
);
const Analysis = React.lazy(() => import('@/screens/analysis/Analysis'));
const AssetDetails = React.lazy(() => import('@/screens/assets/AssetDetails'));
const Insurance = React.lazy(() => import('@/screens/insurance/Insurance'));
const Inspection = React.lazy(() => import('@/screens/inspection/Inspection'));
const Survey = React.lazy(() => import('@/screens/survey/Survey'));
const JCR = React.lazy(() => import('@/screens/jcr/JCR'));
// const HomeScreen = React.lazy(() => import('@screens/home/HomeScreen'));
const Register = React.lazy(
  () => import('@screens/auth/register/RegisterIndex'),
);
const LoginScreen = lazy(() => import('@/screens/auth/LoginScreen'));

export default function AppNavigator() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      animation: 'slide_from_right' as const,
    }),
    [],
  );

  // Every screen sits inside a ScrollView with a sticky Footer at the bottom.
  // Wrapping at the navigator level (vs inside each screen) means we never
  // forget the footer on a new screen, and scroll position resets per route.
  //
  // Keyboard handling lives here too, so it applies to EVERY screen for free —
  // no per-screen wrapping needed. We target Android 15+ (SDK 35+) where the OS
  // ENFORCES edge-to-edge, so windowSoftInputMode="adjustResize" no longer
  // resizes the window. KeyboardAvoidingView instead reads keyboard height from
  // JS keyboard events (independent of adjustResize) and pads the bottom by that
  // height — so behavior="padding" is needed on Android too, not just iOS. The
  // padding shrinks the ScrollView, which then scrolls the focused input into
  // view. keyboardShouldPersistTaps="handled" lets a user tap a button (e.g.
  // Submit) while the keyboard is up; keyboardDismissMode="on-drag" hides it on scroll.
  const screenLayout = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
          <Footer />
        </ScrollView>
      </KeyboardAvoidingView>
    ),
    [],
  );

  // Two distinct stacks based on auth state. We don't render the logged-out
  // screens at all when authenticated — that's safer than relying on screen
  // guards and lets `navigate('Home')` from a logged-in context fail loudly
  // instead of silently rendering a screen the user shouldn't see.
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Dashboard' : 'Login'}
      screenOptions={screenOptions}
      screenLayout={screenLayout}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="LiveStatus" component={LiveStatus} />
          <Stack.Screen name="Performance" component={Performance} />
          <Stack.Screen name="Analysis" component={Analysis} />
          <Stack.Screen name="Assets" component={AssetDetails} />
          <Stack.Screen name="Insurance" component={Insurance} />
          <Stack.Screen name="Inspection" component={Inspection} />
          <Stack.Screen name="Survey" component={Survey} />
          <Stack.Screen name="JCR" component={JCR} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}
