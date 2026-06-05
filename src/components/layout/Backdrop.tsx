import React from 'react';
import { Animated, Pressable } from 'react-native';

interface BackdropProps {
  opacity: Animated.Value;
  onPress: () => void;
}

// Dim overlay shown behind the drawer. Tapping it should close the drawer.
// `pointerEvents="box-none"` is load-bearing: the parent Animated.View itself
// is touch-transparent, but its children (the Pressable) still receive taps.
// Using "box-only" instead would swallow taps at the parent and the inner
// Pressable's onPress would never fire — we hit exactly that bug before.
const Backdrop = React.memo(({ opacity, onPress }: BackdropProps) => (
  <Animated.View
    className="absolute inset-0 bg-black z-40"
    style={{ opacity }}
    pointerEvents="box-none"
  >
    <Pressable className="flex-1" onPress={onPress} />
  </Animated.View>
));

export default Backdrop;
