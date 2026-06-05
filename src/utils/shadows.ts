import { Platform, ViewStyle } from 'react-native';

// Shadow presets shared across cards, tiles, and bubbles.
// iOS reads shadowColor/Offset/Opacity/Radius; Android only reads elevation.
// We declare both so a single preset works on both platforms.

type ShadowPreset = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

// xs: hairline lift for chip-like surfaces sitting on a tinted container
export const shadowXs: ShadowPreset = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 3,
  elevation: 1,
};

// sm: default card lift — Monitoring/Tracking tiles, search card
export const shadowSm: ShadowPreset = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
};

// md: a noticeable lift for prominent surfaces (modal-ish cards, hero CTA)
export const shadowMd: ShadowPreset = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 4,
};

// lg: floating elements over content (chat bubble, FABs)
export const shadowLg: ShadowPreset = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 6,
};

// Web-only platforms occasionally need shadows zeroed to avoid double-rendering
// with CSS box-shadow. We don't ship web, so this is just a hatch if it changes.
export const shadowNone: ShadowPreset =
  Platform.OS === 'web'
    ? { shadowOpacity: 0, elevation: 0 }
    : { elevation: 0 };
