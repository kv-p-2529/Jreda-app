import React from 'react';
import { View } from 'react-native';

// Small vertical gap between siblings. We prefer this over margin-top on the
// child because it composes cleanly inside <ScrollView> and doesn't fight with
// nativewind's `mt-*` utilities applied for design intent on the child itself.

type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<SpacerSize, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

interface SpacerProps {
  size?: SpacerSize | number;
  horizontal?: boolean;
}

export default function Spacer({ size = 'sm', horizontal = false }: SpacerProps) {
  const value = typeof size === 'number' ? size : SIZE_MAP[size];
  return <View style={horizontal ? { width: value } : { height: value }} />;
}
