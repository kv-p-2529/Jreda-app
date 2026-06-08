import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Footer from '@/components/layout/Footer';

// Lets screens scroll the navigator-level ScrollView back to the top — useful
// for in-screen wizards (e.g. registration) where stepping forward doesn't
// change the navigation route, so useFocusEffect alone wouldn't fire.
const ScrollToTopContext = createContext<() => void>(() => {});

export const useScrollToTop = () => useContext(ScrollToTopContext);

// Wraps every screen via AppNavigator's `screenLayout`. See AppNavigator for the
// keyboard-handling rationale.
//
// Auto-scroll-to-top: when a screen gains focus (the user jumps to it — whether
// freshly mounted or re-shown from the stack), we reset the ScrollView to the
// top. useFocusEffect runs on every focus, so re-navigating to an already-mounted
// screen still snaps to the top instead of keeping a stale scroll position.
function ScreenLayout({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  useFocusEffect(scrollToTop);

  return (
    <ScrollToTopContext.Provider value={scrollToTop}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          ref={scrollRef}
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
    </ScrollToTopContext.Provider>
  );
}

export default ScreenLayout;
