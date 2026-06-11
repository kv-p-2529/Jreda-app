import React from 'react';
import { useNavigation } from '@react-navigation/native';

import DashboardActionGrid, {
  ActionTile,
} from './components/DashboardActionGrid';
import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import { TILE_COLORS } from '@/utils/tilePalette';
import { DocumentPencil, SearchPin, SolarSun } from '@/components/SVGIcons';

// Tile config notes:
//   - `customIcon` overrides the Ionicons `icon` string. We still set `icon`
//     to a sentinel like 'custom' so the tile shape stays consistent.
//   - Color trios come from TILE_COLORS so a brand refresh is one-file.
//   - `iconColor` here is used by the Ionicons fallback; the custom SVGs bake
//     their own fill, so it's harmless to leave it set to the palette value.

const MONITORING_TILES: ActionTile[] = [
  {
    key: 'live-status',
    label: 'Live Status',
    icon: 'custom',
    customIcon: <DocumentPencil />,
    iconColor: TILE_COLORS.purple.icon,
    iconBg: TILE_COLORS.purple.iconBg,
    cardBg: '#F4F9FD',
  },
  {
    key: 'performance',
    label: 'Performance',
    icon: 'analytics-outline',
    iconColor: TILE_COLORS.green.icon,
    iconBg: TILE_COLORS.green.iconBg,
    cardBg: '#F1FDF1',
  },
  {
    key: 'analysis',
    label: 'Analysis',
    icon: 'bar-chart-outline',
    iconColor: TILE_COLORS.purple.icon,
    iconBg: TILE_COLORS.purple.iconBg,
    cardBg: '#F8F3FD',
  },
];

const TRACKING_TILES: ActionTile[] = [
  {
    key: 'assets',
    label: 'Assets',
    icon: 'custom',
    customIcon: <SolarSun />,
    iconColor: TILE_COLORS.yellow.icon,
    iconBg: TILE_COLORS.yellow.iconBg,
    cardBg: TILE_COLORS.yellow.cardBg,
  },
  {
    key: 'inspection',
    label: 'Inspection',
    icon: 'custom',
    customIcon: <SearchPin />,
    iconColor: TILE_COLORS.purple.icon,
    iconBg: TILE_COLORS.purple.iconBg,
    cardBg: TILE_COLORS.purple.cardBg,
  },
  // {
  //   key: 'insurance',
  //   label: 'Insurance',
  //   icon: 'document-text-outline',
  //   iconColor: TILE_COLORS.green.icon,
  //   iconBg: TILE_COLORS.green.iconBg,
  //   cardBg: TILE_COLORS.green.cardBg,
  // },
  {
    key: 'jcr-document',
    label: 'JCR Document',
    icon: 'document-outline',
    iconColor: TILE_COLORS.red.icon,
    iconBg: TILE_COLORS.red.iconBg,
    cardBg: TILE_COLORS.red.cardBg,
  },
  {
    key: 'survey',
    label: 'Survey',
    icon: 'clipboard-outline',
    iconColor: TILE_COLORS.orange.icon,
    iconBg: TILE_COLORS.orange.iconBg,
    cardBg: TILE_COLORS.orange.cardBg,
  },
  {
    key: 'grievance',
    label: 'Grievance',
    icon: 'megaphone-outline',
    iconColor: TILE_COLORS.blue.icon,
    iconBg: TILE_COLORS.blue.iconBg,
    cardBg: TILE_COLORS.blue.cardBg,
  },
];

function Dashboard() {
  const navigation = useNavigation<any>();

  // Tiles are declared at module scope (above) for stable identity, but the
  // tap handlers need navigation, so we graft them on here. Add a `case` per
  // tile as its destination screen gets built.
  const monitoringTiles = MONITORING_TILES.map(tile => {
    switch (tile.key) {
      case 'live-status':
        return { ...tile, onPress: () => navigation.navigate('LiveStatus') };
      case 'performance':
        return { ...tile, onPress: () => navigation.navigate('Performance') };
      case 'analysis':
        return { ...tile, onPress: () => navigation.navigate('Analysis') };
      default:
        return tile;
    }
  });

  const trackingTiles = TRACKING_TILES.map(tile => {
    switch (tile.key) {
      case 'assets':
        return { ...tile, onPress: () => navigation.navigate('Assets') };
      case 'insurance':
        return { ...tile, onPress: () => navigation.navigate('Insurance') };
      case 'inspection':
        return { ...tile, onPress: () => navigation.navigate('Inspection') };
      case 'survey':
        return { ...tile, onPress: () => navigation.navigate('Survey') };
      case 'jcr-document':
        return { ...tile, onPress: () => navigation.navigate('JCR') };
      case 'grievance':
        return { ...tile, onPress: () => navigation.navigate('Grievance') };
      default:
        return tile;
    }
  });

  return (
    <DashHOC title="User Dashboard">
      <DashboardActionGrid title="Monitoring" tiles={monitoringTiles} />
      <DashboardActionGrid
        gradient={false}
        title="Tracking"
        tiles={trackingTiles}
      />
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default Dashboard;
