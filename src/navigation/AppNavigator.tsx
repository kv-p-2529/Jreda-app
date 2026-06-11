import React, { useCallback, useMemo, lazy } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../store/store';
import ScreenLayout from '@/components/layout/ScreenLayout';
import { ReceiptData } from '@/pdfs/PaymentReceipt';

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
  Grievance: undefined;
  AddComplaint: undefined;
  Receipt: { data: ReceiptData };
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
const Register = React.lazy(
  () => import('@screens/auth/register/RegisterIndex'),
);
const LoginScreen = lazy(() => import('@/screens/auth/LoginScreen'));
const Grievance = lazy(() => import('@screens/grievance/Grievance'));
const AddComplaint = lazy(() => import('@screens/grievance/AddComplaint'));
const ReceiptScreen = lazy(() => import('@screens/receipt/ReceiptScreen'));

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

  const protectedRoutes: {
    name: keyof RootStackParamList;
    component: React.ComponentType<any>;
  }[] = [
    { name: 'Dashboard', component: Dashboard },
    { name: 'LiveStatus', component: LiveStatus },
    { name: 'Performance', component: Performance },
    { name: 'Analysis', component: Analysis },
    { name: 'Assets', component: AssetDetails },
    { name: 'Insurance', component: Insurance },
    { name: 'Inspection', component: Inspection },
    { name: 'Survey', component: Survey },
    { name: 'JCR', component: JCR },
    { name: 'Grievance', component: Grievance },
    { name: 'AddComplaint', component: AddComplaint },
    { name: 'Receipt', component: ReceiptScreen },
  ];

  const publicRoutes: {
    name: keyof RootStackParamList;
    component: React.ComponentType<any>;
  }[] = [
    { name: 'Login', component: LoginScreen },
    { name: 'Register', component: Register },
    // Reachable from the registration "Download Receipt" flow, which runs while
    // the user is still unauthenticated — so Receipt must exist in this stack too.
    { name: 'Receipt', component: ReceiptScreen },
  ];

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
          {protectedRoutes?.map(route => (
            <Stack.Screen
              key={route?.name}
              name={route?.name}
              component={route?.component}
            />
          ))}
        </>
      ) : (
        <>
          {publicRoutes?.map(route => (
            <Stack.Screen
              key={route?.name}
              name={route?.name}
              component={route?.component}
            />
          ))}
        </>
      )}
    </Stack.Navigator>
  );
}
