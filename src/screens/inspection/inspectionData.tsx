import React from 'react';

import { ChecklistItem } from './components/ChecklistTable';
import { SolarSun } from '@/components/SVGIcons';

// Hard-coded inspection record backing the (view-only) Site Inspection page.
// Read straight into the table + verdict card.

export const GREEN = '#22A45A';

export const CHECKLIST: ChecklistItem[] = [
  {
    key: 'silicon-cells',
    icon: 'custom',
    customIcon: <SolarSun color={GREEN} width={16} />,
    label: 'Indigenous mono/multi crystalline silicon solar cells',
    type: 'yesno',
    value: 'yes',
  },
  {
    key: 'pv-count',
    icon: 'cube-outline',
    label: 'No. of PV Modules',
    type: 'number',
    value: '4',
    hint: '[9 - > =]',
  },
  {
    key: 'pv-connections',
    icon: 'git-network-outline',
    label: 'PV Modules electrical connections are tight and seure',
    type: 'yesno',
    value: 'yes',
  },
  {
    key: 'pv-clean',
    icon: 'water-outline',
    label: 'PV Modules are neat and clean',
    type: 'yesno',
    value: 'yes',
  },
  {
    key: 'pv-crack',
    icon: 'eye-outline',
    label: 'Visually crack/ any other issue found',
    type: 'yesno',
    value: 'yes',
  },
  {
    key: 'wattage-mismatch',
    icon: 'flash-outline',
    label:
      'Module  to Module vattage mismatch in the SPV array mismatch shall be within +- 3 percent.',
    type: 'yesno',
    value: 'yes',
  },
];

// Verdict options; the recorded one is rendered selected (others greyed).
export const VERDICT: 'satisfied' | 'not' = 'satisfied';
