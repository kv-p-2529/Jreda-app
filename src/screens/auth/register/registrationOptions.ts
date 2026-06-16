import type { SelectOption } from '@/components/ui/form/FormSelect';

// Dropdown options for the registration form.
//
// Most option lists now come from the master-list API (see `buildMasterOptions`
// below, fed by RegisterIndex's fetchMasterList()). The only static lists left
// are the ones the API doesn't provide:
//   • STATES   — the scheme is Jharkhand-only; the field is fixed/disabled.
//   • YES_NO   — generic boolean dropdowns (e.g. "Beneficiary Existing Pump").
// The taluka/village/block lists come from the location-cascade endpoint
// (see useLocationCascade), not from here.

export const STATES: SelectOption[] = [
  { label: 'Jharkhand', value: 'jharkhand' },
];

export const YES_NO: SelectOption[] = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
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
  // Pump capacity (hp, as string) → farmer contribution amount (INR, as
  // string). Derived from the master list's `rate_card`, not a dropdown.
  rateCard: Record<string, string>;
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
    // rate_card arrives as [{ pump_capacity_hp, amount_rs }]. Index it by
    // capacity so the form can look up the contribution on selection. amount_rs
    // comes as e.g. "5000.00" — normalise to "5000" to match the field format.
    rateCard: (raw?.rate_card ?? []).reduce(
      (acc: Record<string, string>, item: any) => {
        const hp = item?.pump_capacity_hp;
        const amount = Number(item?.amount_rs);
        if (hp != null && !Number.isNaN(amount)) {
          acc[String(hp)] = String(amount);
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
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
