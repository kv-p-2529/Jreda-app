import {
  APPLICANT_CATEGORY,
  APPLICATION_CATEGORY,
  CONTROLLER_TYPE,
  CROP_TYPE,
  DISTRICTS,
  GENDER,
  PUMP_CAPACITY,
  PUMP_SUB_TYPE,
  PUMP_TYPE,
  SOURCE_OF_IRRIGATION,
  SOURCE_OF_WATER,
  STATES,
  YES_NO,
  type MasterOptions,
} from '../registrationOptions';
import type { PersonalDetailsValues } from '../registrationSchemas';
import type { LocationCascade } from './useLocationCascade';
import type { SelectOption } from '@/components/ui/form/FormSelect';
import { FIXED_STATE } from './registrationDefaults';

// Prefer the API-provided options for a field; fall back to the static list
// when the master list hasn't loaded yet (or doesn't cover that field).
export const optionsFor = (
  options: MasterOptions | undefined,
  key: keyof MasterOptions,
  fallback: SelectOption[],
): SelectOption[] => (options?.[key]?.length ? options[key]! : fallback);

// Flatten every select's current options into one value→label lookup, so the
// preview can render names ("Barhi") instead of the stored codes ("2645").
// Codes are unique across fields, so a single flat map is safe.
export function buildLabelMap(
  options: MasterOptions | undefined,
  cascade: LocationCascade,
): Record<string, string> {
  const opt = (key: keyof MasterOptions, fallback: SelectOption[]) =>
    optionsFor(options, key, fallback);

  const all: SelectOption[] = [
    ...opt('applicationCategory', APPLICATION_CATEGORY),
    ...opt('applicantCategory', APPLICANT_CATEGORY),
    ...opt('gender', GENDER),
    ...YES_NO,
    ...STATES,
    ...opt('district', DISTRICTS),
    ...cascade.resTalukas,
    ...cascade.locTalukas,
    ...cascade.resVillages,
    ...cascade.locVillages,
    ...cascade.resBlocks,
    ...cascade.locBlocks,
    ...opt('pumpCapacity', PUMP_CAPACITY),
    ...opt('pumpType', PUMP_TYPE),
    ...opt('pumpSubType', PUMP_SUB_TYPE),
    ...opt('controllerType', CONTROLLER_TYPE),
    ...opt('cropType', CROP_TYPE),
    ...opt('sourceOfIrrigation', SOURCE_OF_IRRIGATION),
    ...opt('sourceOfWater', SOURCE_OF_WATER),
  ];
  const map: Record<string, string> = {};
  all.forEach(o => {
    if (o.value !== '') map[o.value] = o.label;
  });
  return map;
}

// Build the request body for one section (1–6) from the current form values,
// mapping rhf field names → the snake_case keys the backend expects. The address
// sections need both the stored code AND the human name, so we pull the name out
// of the value→label map (`labels`). Optional fields are omitted when blank
// rather than sent as empty strings.
export function buildSectionPayload(
  section: number,
  v: PersonalDetailsValues,
  labels: Record<string, string>,
  aadhaarLast4?: string,
): Record<string, any> {
  // code → human-readable name (for the *_code / *_name pairs).
  const nameOf = (code?: string) => (code ? labels[code] ?? code : '');
  const hasPump = v.beneficiaryExistingPump === 'yes';

  switch (section) {
    // Section 1 — Applicant Details
    case 1:
      return {
        application_category: v.applicationCategory,
        name: v.applicantName,
        father_husband_name: v.fatherName,
        caste: v.applicantCategory,
        gender: v.gender,
        aadhaar_last4: aadhaarLast4 ?? '',
        mobile: v.mobile,
        ...(v.email ? { email: v.email } : {}),
      };

    // Section 2 — Residential Address
    case 2:
      return {
        res_district_code: v.residential.district,
        res_district_name: nameOf(v.residential.district),
        res_taluka_code: v.residential.taluka,
        res_taluka_name: nameOf(v.residential.taluka),
        res_village_code: v.residential.village,
        res_village_name: nameOf(v.residential.village),
        res_block_code: v.residential.block,
        res_block_name: nameOf(v.residential.block),
        res_panchayat: v.residential.panchayat,
        ...(v.residential.policeStation
          ? { res_police_station: v.residential.policeStation }
          : {}),
        ...(v.residential.postOffice
          ? { res_post_office: v.residential.postOffice }
          : {}),
        res_pincode: v.residential.pinCode,
      };

    // Section 3 — Existing Pump. The ex_* fields only go up when the
    // beneficiary actually has a pump (and are required in that case).
    case 3:
      return {
        has_existing_pump: hasPump,
        ...(hasPump
          ? {
              ex_pump_capacity_hp: Number(v.existingPumpCapacity),
              ex_pump_type: v.existingPumpType,
              ex_pump_sub_type: v.existingPumpSubType,
              ex_pump_category: v.pumpCategory,
              ex_pump_fuel: v.pumpFuel,
              ...(v.generation
                ? { ex_pump_generation: v.generation }
                : {}),
            }
          : {}),
      };

    // Section 4 — Location Address + Land
    case 4:
      return {
        loc_district_code: v.location.district,
        loc_district_name: nameOf(v.location.district),
        loc_taluka_code: v.location.taluka,
        loc_taluka_name: nameOf(v.location.taluka),
        loc_village_code: v.location.village,
        loc_village_name: nameOf(v.location.village),
        loc_block_code: v.location.block,
        loc_block_name: nameOf(v.location.block),
        loc_panchayat: v.location.panchayat,
        ...(v.location.policeStation
          ? { loc_police_station: v.location.policeStation }
          : {}),
        ...(v.location.postOffice
          ? { loc_post_office: v.location.postOffice }
          : {}),
        loc_pincode: v.location.pinCode,
        land_area_acres: Number(v.location.areaInAcres),
        land_area_sqmt: Number(v.location.areaInSqMtr),
        lagaan_rasid_date: v.location.lagaanRasidDate,
      };

    // Section 5 — Required Pump Details.
    // NOTE: the backend expects `pump_category` here, but the "Required Pump
    // Details" UI has no dedicated field for it — we reuse the existing-pump
    // `pumpCategory`. Add a separate field/select if these must differ.
    case 5:
      return {
        pump_capacity_hp: Number(v.pumpCapacity),
        pump_type: v.pumpType,
        pump_sub_type: v.pumpSubType,
        pump_category: v.pumpCategory,
        controller_type: v.controllerType,
        farmer_contribution_rs: Number(v.farmerContribution),
      };

    // Section 6 — Irrigation Details. Crop fields are optional; the borewell
    // dimensions have no inputs in this form yet, so they go up as null (the
    // backend only requires them when water_source is a borewell).
    case 6:
      return {
        irrigation_mode: v.sourceOfIrrigation,
        water_source: v.sourceOfWater,
        ...(v.cropTypeLast ? { crop_type_y1: v.cropTypeLast } : {}),
        ...(v.cropCountLast ? { crop_count_y1: Number(v.cropCountLast) } : {}),
        ...(v.cropTypeLastToLast
          ? { crop_type_y2: v.cropTypeLastToLast }
          : {}),
        ...(v.cropCountLastToLast
          ? { crop_count_y2: Number(v.cropCountLastToLast) }
          : {}),
        borewell_size_inch: null,
        borewell_depth_ft: null,
      };

    default:
      return {};
  }
}

// Stringify a draft value for the form (all rhf fields are strings). null /
// undefined become '' so optional/unfilled fields stay empty rather than the
// literal "null".
const str = (v: unknown): string =>
  v === null || v === undefined ? '' : String(v);

// Map a resumed draft (the backend's flat snake_case row from GET /registration/
// :token) back into the form's PersonalDetailsValues shape, so the details form
// prefills on resume. This is the inverse of buildSectionPayload: numbers/
// booleans are stringified, and nested address objects are returned in full
// because the screen shallow-merges defaultValues over initialValues.
export function mapDraftToFormValues(
  draft: any,
): Partial<PersonalDetailsValues> {
  if (!draft) return {};

  // has_existing_pump is a boolean (or null) on the server; the form uses a
  // yes/no select — leave it unselected ('') when the server hasn't recorded it.
  const beneficiaryExistingPump =
    draft.has_existing_pump === true
      ? 'yes'
      : draft.has_existing_pump === false
      ? 'no'
      : '';

  return {
    // Section 1 — Applicant Details
    applicationCategory: str(draft.application_category),
    applicantName: str(draft.name),
    fatherName: str(draft.father_husband_name),
    applicantCategory: str(draft.caste),
    gender: str(draft.gender),
    mobile: str(draft.mobile),
    email: str(draft.email),

    // Section 2 — Residential Address (full object; state is fixed to Jharkhand)
    residential: {
      state: FIXED_STATE,
      district: str(draft.res_district_code),
      taluka: str(draft.res_taluka_code),
      village: str(draft.res_village_code),
      block: str(draft.res_block_code),
      panchayat: str(draft.res_panchayat),
      policeStation: str(draft.res_police_station),
      postOffice: str(draft.res_post_office),
      pinCode: str(draft.res_pincode),
    },

    // Section 3 — Existing Pump
    beneficiaryExistingPump,
    existingPumpCapacity: str(draft.ex_pump_capacity_hp),
    existingPumpType: str(draft.ex_pump_type),
    existingPumpSubType: str(draft.ex_pump_sub_type),
    pumpFuel: str(draft.ex_pump_fuel),
    generation: str(draft.ex_pump_generation),
    // pumpCategory is shared by the existing-pump (ex_pump_category) and the
    // required-pump (pump_category) sections — the form has only one field.
    // Prefer the required-pump value, fall back to the existing-pump one.
    pumpCategory: str(draft.pump_category ?? draft.ex_pump_category),

    // Section 4 — Location Address + Land
    location: {
      state: FIXED_STATE,
      district: str(draft.loc_district_code),
      taluka: str(draft.loc_taluka_code),
      village: str(draft.loc_village_code),
      block: str(draft.loc_block_code),
      panchayat: str(draft.loc_panchayat),
      policeStation: str(draft.loc_police_station),
      postOffice: str(draft.loc_post_office),
      pinCode: str(draft.loc_pincode),
      areaInAcres: str(draft.land_area_acres),
      areaInSqMtr: str(draft.land_area_sqmt),
      lagaanRasidDate: str(draft.lagaan_rasid_date),
    },

    // Section 5 — Required Pump Details
    pumpCapacity: str(draft.pump_capacity_hp),
    pumpType: str(draft.pump_type),
    pumpSubType: str(draft.pump_sub_type),
    controllerType: str(draft.controller_type),
    farmerContribution: str(draft.farmer_contribution_rs),

    // Section 6 — Irrigation Details
    cropTypeLast: str(draft.crop_type_y1),
    cropCountLast: str(draft.crop_count_y1),
    cropTypeLastToLast: str(draft.crop_type_y2),
    cropCountLastToLast: str(draft.crop_count_y2),
    sourceOfIrrigation: str(draft.irrigation_mode),
    sourceOfWater: str(draft.water_source),
  };
}
