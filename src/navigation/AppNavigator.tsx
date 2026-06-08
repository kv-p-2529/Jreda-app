import React, { useCallback, useMemo, lazy } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/store';
import ScreenLayout from '@/components/layout/ScreenLayout';

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
  // ScreenLayout also auto-scrolls back to the top each time a screen is focused.
  const screenLayout = useCallback(
    ({ children }: { children: React.ReactNode }) => (
      <ScreenLayout>{children}</ScreenLayout>
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
