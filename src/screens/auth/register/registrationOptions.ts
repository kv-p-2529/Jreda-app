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
  { label: '1 hp', value: '1' },
  { label: '2 hp', value: '2' },
  { label: '3 hp', value: '3' },
  { label: '5 hp', value: '5' },
  { label: '7.5 hp', value: '7.5' },
  { label: '10 hp', value: '10' },
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
