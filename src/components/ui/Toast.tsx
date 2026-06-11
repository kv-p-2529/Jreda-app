import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

// Cross-platform toast overlay. Android already has a great native toast
// (ToastAndroid), so showToast() in utils/helpers only routes iOS / non-Android
// platforms here — this gives them a real auto-dismissing toast instead of a
// blocking Alert. Mount <ToastHost /> exactly once near the app root (App.tsx).
//
// The API is imperative (showOverlayToast) rather than a hook/context so it can
// be called from plain functions like showToast without a component in scope.
// A single module-level listener is wired up by the mounted host; if no host is
// mounted the call is a harmless no-op.

type Listener = (message: string) => void;

let listener: Listener | null = null;

// How long the toast stays fully visible before it fades out.
const VISIBLE_MS = 2200;
const FADE_IN_MS = 180;
const FADE_OUT_MS = 250;

export function showOverlayToast(message: string) {
  // No-op if ToastHost isn't mounted yet — never throws on the caller.
  listener?.(message);
}

export default function ToastHost() {
  const [message, setMessage] = useState<string | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    listener = (msg: string) => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
      setMessage(msg);
      Animated.timing(opacity, {
        toValue: 1,
        duration: FADE_IN_MS,
        useNativeDriver: true,
      }).start();
      hideTimer.current = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_OUT_MS,
          useNativeDriver: true,
        }).start(({ finished }) => {
          // Only unmount the text once the fade actually completed, so a new
          // toast arriving mid-fade (which restarts the animation) isn't wiped.
          if (finished) {
            setMessage(null);
          }
        });
      }, VISIBLE_MS);
    };
    return () => {
      listener = null;
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, [opacity]);

  if (message == null) {
    return null;
  }

  // pointerEvents="none" so the overlay never intercepts taps meant for the UI.
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Animated.View style={[styles.toast, { opacity }]}>
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 64,
  },
  toast: {
    maxWidth: '85%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
});
