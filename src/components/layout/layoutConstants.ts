import { Dimensions } from 'react-native';

// Layout-level constants. Things here are referenced by the navbar, drawer,
// and footer and should change in one place if the design changes.

export const SCREEN_WIDTH = Dimensions.get('window').width;

// Drawer takes 78% of the screen — leaves a touch of backdrop visible so users
// can see the page underneath and intuit that tapping outside closes it.
export const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

// Drawer menu items. The two-letter `icon` strings are placeholders rendered
// inside a colored disc by DrawerMenu — swap to real icons later when design
// finalizes them.
export const NAV_ITEMS = [
  { label: 'Application Status', icon: 'AS' },
  { label: 'Complaint Registration', icon: 'CR' },
  { label: 'Public Information', icon: 'PI' },
  { label: 'Download Receipt', icon: 'DR' },
  { label: 'Payment Enquiry', icon: 'PE' },
  { label: 'Central Portal Link', icon: 'CP' },
] as const;

// Footer link sections. Kept here (rather than inside Footer.tsx) so a
// content-only update doesn't need to touch the rendering component.
export const MAIN_LINKS = [
  { label: 'Installers' },
  { label: 'Applications Status' },
  { label: 'Important Documents' },
] as const;

export const USEFUL_LINKS = [
  { label: 'Achievement' },
  { label: 'Contact us' },
] as const;

// FontAwesome icon names — `youtube-play` is the legacy name in FA4 and is
// what's bundled with react-native-vector-icons/fontawesome.
export const SOCIAL_LINKS = [
  { icon: 'facebook' },
  { icon: 'twitter' },
  { icon: 'linkedin' },
  { icon: 'instagram' },
  { icon: 'youtube-play' },
] as const;
