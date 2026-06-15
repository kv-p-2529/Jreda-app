import type { SelectOption } from '@/components/ui/form/FormSelect';

// Dropdown options for the registration form. These are static placeholders;
// once the API is wired, STATES / DISTRICTS / TALUKAS / VILLAGES / BLOCKS
// should come from a cascading endpoint (district list depends on state, etc.)
// — keep the SelectOption shape so swapping data sources doesn't require
// touching the form components themselves.

export const APPLICATION_CATEGORY: SelectOption[] = [
  { label: 'Individual Farmer', value: 'individual' },
  { label: 'Group of Farmers', value: 'group' },
  { label: 'Co-operative', value: 'cooperative' },
];

export const APPLICANT_CATEGORY: SelectOption[] = [
  { label: 'General', value: 'general' },
  { label: 'SC', value: 'sc' },
  { label: 'ST', value: 'st' },
  { label: 'OBC', value: 'obc' },
];

export const GENDER: SelectOption[] = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const STATES: SelectOption[] = [
  { label: 'Jharkhand', value: 'jharkhand' },
  { label: 'Bihar', value: 'bihar' },
  { label: 'West Bengal', value: 'west-bengal' },
  { label: 'Odisha', value: 'odisha' },
];

export const DISTRICTS: SelectOption[] = [
  { label: 'Ranchi', value: 'ranchi' },
  { label: 'Godda', value: 'godda' },
  { label: 'Dhanbad', value: 'dhanbad' },
  { label: 'Bokaro', value: 'bokaro' },
];

export const TALUKAS: SelectOption[] = [
  { label: 'Ranchi', value: 'ranchi' },
  { label: 'Godda', value: 'godda' },
];

export const VILLAGES: SelectOption[] = [
  { label: 'Ranchi', value: 'ranchi' },
  { label: 'Meharma', value: 'meharma' },
];

export const BLOCKS: SelectOption[] = [
  { label: 'Block A', value: 'block-a' },
  { label: 'Block B', value: 'block-b' },
];

export const YES_NO: SelectOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const PUMP_CAPACITY: SelectOption[] = [
  { label: '2 hp', value: '2' },
  { label: '3 hp', value: '3' },
  { label: '5 hp', value: '5' },
];

export const PUMP_TYPE: SelectOption[] = [
  { label: 'AC', value: 'ac' },
  { label: 'DC', value: 'dc' },
];

export const PUMP_SUB_TYPE: SelectOption[] = [
  { label: 'Submersible', value: 'submersible' },
  { label: 'Surface', value: 'surface' },
];

export const CONTROLLER_TYPE: SelectOption[] = [
  { label: 'Normal', value: 'normal' },
  { label: 'Universal', value: 'universal' },
];

export const CROP_TYPE: SelectOption[] = [
  { label: 'Rabi', value: 'rabi' },
  { label: 'Zaid', value: 'zaid' },
  { label: 'Kharif', value: 'kharif' },
];

export const SOURCE_OF_IRRIGATION: SelectOption[] = [
  { label: 'Micro Irrigation', value: 'micro' },
  { label: 'Drip', value: 'drip' },
  { label: 'Sprinkler', value: 'sprinkler' },
  { label: 'Flood', value: 'flood' },
];

export const SOURCE_OF_WATER: SelectOption[] = [
  { label: 'Borewell', value: 'borewell' },
  { label: 'Open well', value: 'open-well' },
  { label: 'River', value: 'river' },
  { label: 'Pond', value: 'pond' },
];

// ─── Existing-pump details ────────────────────────────────────────────────
// Only shown when "Beneficiary Existing Pump" is "Yes". Mirrors the legacy
// portal's dropdowns.

export const EXISTING_PUMP_CAPACITY: SelectOption[] = [
  { label: '2 hp', value: '2' },
  { label: '3 hp', value: '3' },
  { label: '5 hp', value: '5' },
];

export const EXISTING_PUMP_TYPE: SelectOption[] = [
  { label: 'AC', value: 'ac' },
  { label: 'DC', value: 'dc' },
];

export const EXISTING_PUMP_SUBTYPE: SelectOption[] = [
  { label: 'Submersible', value: 'submersible' },
  { label: 'Surface', value: 'surface' },
];

export const PUMP_CATEGORY: SelectOption[] = [
  { label: 'Oil filled', value: 'oil-filled' },
  { label: 'Water Filled', value: 'water-filled' },
];

export const PUMP_FUEL: SelectOption[] = [
  { label: 'Electricity', value: 'electricity' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Generator', value: 'generator' },
];

// ─── Master-list (API) options ────────────────────────────────────────────
// The /app/master/filter-options endpoint returns the canonical dropdown data.
// `buildMasterOptions` reshapes that raw response into the SelectOption[] shape
// the form components expect, so screens can swap static → API options without
// any other changes. Fields the master list doesn't cover (state, the
// taluka/village/block cascade) stay on the static lists above.

export type MasterOptions = {
  applicationCategory: SelectOption[];
  applicantCategory: SelectOption[];
  gender: SelectOption[];
  pumpCapacity: SelectOption[];
  pumpType: SelectOption[];
  pumpSubType: SelectOption[];
  pumpCategory: SelectOption[];
  controllerType: SelectOption[];
  pumpFuel: SelectOption[];
  sourceOfIrrigation: SelectOption[];
  sourceOfWater: SelectOption[];
  cropType: SelectOption[];
  district: SelectOption[];
};

// Map a plain string/number array to options, using the raw item as both the
// stored value (what the backend expects back) and the displayed label.
const toOptions = (arr?: (string | number)[]): SelectOption[] =>
  (arr ?? []).map(item => ({ label: String(item), value: String(item) }));

export function buildMasterOptions(raw: any): MasterOptions {
  return {
    applicationCategory: toOptions(raw?.application_categories),
    applicantCategory: toOptions(raw?.castes),
    gender: toOptions(raw?.genders),
    pumpCapacity: (raw?.pump_capacities ?? []).map((n: string | number) => ({
      label: `${n} HP`,
      value: String(n),
    })),
    pumpType: toOptions(raw?.pump_types),
    pumpSubType: toOptions(raw?.pump_sub_types),
    pumpCategory: toOptions(raw?.pump_categories),
    controllerType: toOptions(raw?.controller_types),
    pumpFuel: toOptions(raw?.pump_fuels),
    // irrigation_modes already arrives as { value, label }.
    sourceOfIrrigation: (raw?.irrigation_modes ?? []).map((m: any) => ({
      label: m?.label ?? String(m?.value),
      value: String(m?.value),
    })),
    sourceOfWater: toOptions(raw?.water_sources),
    cropType: toOptions(raw?.crop_types),
    // districts arrive as { district_code, district_name }.
    district: (raw?.districts ?? []).map((d: any) => ({
      label: d?.district_name,
      value: String(d?.district_code),
    })),
  };
}

// Map a location-cascade response (talukas / towns / blocks) to options. Those
// endpoints all return arrays of `{ <thing>_code, <thing>_name, ... }`, so we
// pass the relevant key pair, e.g.
//   mapCodeNameOptions(data, 'taluka_code', 'taluka_name')
//   mapCodeNameOptions(data, 'block_code',  'block_name')
//   mapCodeNameOptions(data, 'town_code',   'town_name')
export function mapCodeNameOptions(
  arr: any,
  codeKey: string,
  nameKey: string,
): SelectOption[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((item: any) => ({
    label: String(item?.[nameKey] ?? ''),
    value: String(item?.[codeKey] ?? ''),
  }));
}

// ─── Display helpers ──────────────────────────────────────────────────────

// Map a stored option `value` back to its human-readable `label` for read-only
// displays (e.g. the preview step). Falls back to the raw value if it's not in
// the list — better to show something than blank if data drifts from options.
export function getOptionLabel(
  options: SelectOption[],
  value?: string,
): string {
  if (!value) return '';
  return options.find(o => o.value === value)?.label ?? value;
}

// ─── Auto-fill helpers ────────────────────────────────────────────────────

// 1 acre = 4046.8564224 m². Used to derive "Area of Land in SqMtr" from acres.
export const SQMTR_PER_ACRE = 4046.8564224;

// Farmer contribution (INR) auto-filled from the selected required Pump
// Capacity. PLACEHOLDER values — replace with the official PM-KUSUM fee slab
// once the backend provides it. Keyed by PUMP_CAPACITY value (hp as string).
export const PUMP_CAPACITY_CONTRIBUTION: Record<string, string> = {
  '2': '5000',
  '3': '7000',
  '5': '10000',
};
