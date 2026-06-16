import type { PersonalDetailsValues } from '../registrationSchemas';

// Default/empty values for the PersonalDetails form. Kept out of the screen so
// the component file stays focused on wiring + layout.

// State is fixed to Jharkhand for this portal — the value stored in the form.
export const FIXED_STATE = 'jharkhand';

const emptyAddress = {
  state: '',
  district: '',
  taluka: '',
  village: '',
  block: '',
  panchayat: '',
  policeStation: '',
  postOffice: '',
  pinCode: '',
};

export const initialValues: PersonalDetailsValues = {
  applicationCategory: '',
  applicantName: '',
  fatherName: '',
  applicantCategory: '',
  gender: '',
  mobile: '',
  email: '',
  // State is pre-set and locked to Jharkhand in both addresses.
  residential: { ...emptyAddress, state: FIXED_STATE },
  beneficiaryExistingPump: '',
  // Existing-pump details — populated only when the user has an existing pump.
  existingPumpCapacity: '',
  existingPumpType: '',
  existingPumpSubType: '',
  pumpCategory: '',
  generation: '',
  pumpFuel: '',
  location: {
    ...emptyAddress,
    state: FIXED_STATE,
    areaInAcres: '',
    areaInSqMtr: '',
    lagaanRasidDate: '',
  },
  pumpCapacity: '',
  pumpType: '',
  pumpSubType: '',
  controllerType: '',
  farmerContribution: '',
  cropTypeLast: '',
  cropCountLast: '',
  cropTypeLastToLast: '',
  cropCountLastToLast: '',
  sourceOfIrrigation: '',
  sourceOfWater: '',
  borewellSize: '',
  borewellDepth: '',
};
