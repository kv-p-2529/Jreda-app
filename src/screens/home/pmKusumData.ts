import compA from '@assets/compA.png';
import compB from '@assets/compB.png';
import compC from '@assets/compC.png';
import compD from '@assets/compD.png';

// Component cards for the "About PM-KUSUM" section. Each card carries its
// data + the per-component LinearGradient stops + the brand color for the
// subtitle text, all in one place.
export const components = [
  {
    id: 1,
    title: 'Grid Connected Solar Power Plants',
    subtitle: 'Component A',
    image: compA,
    colors: ['#D7FFD5', '#E8FFE7', '#ffffff'],
    textColor: '#00C400',
  },
  {
    id: 2,
    title: 'Off Grid Solar Pumps',
    subtitle: 'Component B',
    image: compB,
    colors: ['#E7D2FF', '#F5E9FF', '#ffffff'],
    textColor: '#5A2DBD',
  },
  {
    id: 3,
    title: 'Grid Connected Solar Pumps',
    subtitle: 'Component C (IPS)',
    image: compC,
    colors: ['#D5E8FF', '#EAF3FF', '#ffffff'],
    textColor: '#1677FF',
  },
  {
    id: 4,
    title: 'Solarization Of Feeders',
    subtitle: 'Component C (FLS)',
    image: compD,
    colors: ['#FFE1BF', '#FFF1E2', '#ffffff'],
    textColor: '#FF6B00',
  },
];
