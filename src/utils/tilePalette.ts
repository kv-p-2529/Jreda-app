// Color tokens for the category-coded tiles on the dashboard.
//
// Each category has THREE shades that work together:
//   - icon:     stroke/fill color on the icon itself (most saturated)
//   - iconBg:   filled disc behind the icon (mid)
//   - cardBg:   tint for the tile surface (lightest — barely there)
//
// Keep these together so it's obvious which trio belongs to which category.
// If you ever add a new category, add a full entry — never half-define one.

export type TileColorKey =
  | 'purple'
  | 'green'
  | 'yellow'
  | 'red'
  | 'orange'
  | 'blue';

export interface TileColor {
  icon: string;
  iconBg: string;
  cardBg: string;
}

export const TILE_COLORS: Record<TileColorKey, TileColor> = {
  purple: { icon: '#7C3AED', iconBg: '#EDE6FB', cardBg: '#F5EEFB' },
  green: { icon: '#16A34A', iconBg: '#DFF3E4', cardBg: '#E8F5EC' },
  yellow: { icon: '#F59E0B', iconBg: '#FEF1C7', cardBg: '#FFFBEB' },
  red: { icon: '#EF4444', iconBg: '#FCDCDC', cardBg: '#FCEAEA' },
  orange: { icon: '#F97316', iconBg: '#FEE2C7', cardBg: '#FEEED9' },
  blue: { icon: '#1382F5', iconBg: '#E1EFFE', cardBg: '#F4F9FD' },
};

// Brand colors used outside the tile palette. Centralized so a brand refresh
// is a one-file change instead of a grep-and-replace exercise.
export const BRAND = {
  primary: '#1382F5',
  primaryDark: '#0047B8',
  surface: '#F4F8FE',
  text: '#1B1B1B',
  textMuted: '#6B7280',
};
