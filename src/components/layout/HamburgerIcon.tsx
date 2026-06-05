import React, { useMemo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface HamburgerIconProps {
  isOpen: boolean;
}

// Three-line hamburger that morphs into an X when the drawer opens.
// Top + bottom lines rotate ±45° to form the X, and the middle line hides.
// The marginTop shifts converge the two lines onto the same y-position so the
// X looks centered instead of floating.
const HamburgerIcon = React.memo(({ isOpen }: HamburgerIconProps) => {
  const topLineStyle = useMemo(
    () => [
      styles.line,
      {
        transform: [{ rotate: isOpen ? '45deg' : '0deg' }],
        marginTop: isOpen ? 8 : 0,
      },
    ],
    [isOpen],
  );
  const bottomLineStyle = useMemo(
    () => [
      styles.line,
      {
        transform: [{ rotate: isOpen ? '-45deg' : '0deg' }],
        marginTop: isOpen ? -10 : 0,
      },
    ],
    [isOpen],
  );

  return (
  <View className="w-7 h-5 justify-between">
    <Animated.View
      className="h-0.5 bg-white rounded-full"
      style={topLineStyle}
    />
    {!isOpen && <View className="w-5 h-0.5 bg-white rounded-full self-end" />}
    <Animated.View
      className="h-0.5 bg-white rounded-full"
      style={bottomLineStyle}
    />
  </View>
  );
});

const styles = StyleSheet.create({
  line: {
    width: 24,
  },
});

export default HamburgerIcon;
