import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import FormInput from '@/components/ui/form/FormInput';
import FormSelect from '@/components/ui/form/FormSelect';
import FormDate from '@/components/ui/form/FormDate';
import FormSection from '@/components/ui/form/FormSection';
import type { SelectOption } from '@/components/ui/form/FormSelect';

// Step 2 — the big form. Address fields appear twice (residential + land
// location) under different prefixes; we lean on rhf's nested-path support
// (`residential.state`, `location.state`) to keep schema and UI parallel.
//
// The heavy lifting lives in siblings: defaults (`registrationDefaults`), the
// value→label + per-section payload mapping (`personalDetailsPayload`), the
// district→taluka/village/block cascade (`useLocationCascade`), and the
// per-section auto-save (`useSectionAutosave`). This file is just layout +
// wiring. `personalDetailsSchema` drives the resolver — validation must be live
// because the section saves are gated on it.
import {
  PersonalDetailsValues,
  personalDetailsSchema,
} from '../registrationSchemas';
import {
  APPLICANT_CATEGORY,
  APPLICATION_CATEGORY,
  BLOCKS,
  CONTROLLER_TYPE,
  CROP_TYPE,
  DISTRICTS,
  EXISTING_PUMP_CAPACITY,
  EXISTING_PUMP_SUBTYPE,
  EXISTING_PUMP_TYPE,
  GENDER,
  PUMP_CAPACITY,
  PUMP_CAPACITY_CONTRIBUTION,
  PUMP_CATEGORY,
  PUMP_FUEL,
  PUMP_SUB_TYPE,
  PUMP_TYPE,
  SOURCE_OF_IRRIGATION,
  SOURCE_OF_WATER,
  SQMTR_PER_ACRE,
  STATES,
  TALUKAS,
  VILLAGES,
  YES_NO,
  type MasterOptions,
} from '../registrationOptions';
import { initialValues } from './registrationDefaults';
import { buildLabelMap, optionsFor } from './personalDetailsPayload';
import { useLocationCascade } from './useLocationCascade';
import { useSectionAutosave } from './useSectionAutosave';

type Props = {
  defaultValues?: Partial<PersonalDetailsValues>;
  // Dropdown options from the master-list API. Optional so the screen still
  // renders (on the static fallbacks) before the response lands.
  options?: MasterOptions;
  // `labels` is a value→label lookup for the select fields, so downstream
  // (PreviewScreen) can show human-readable names instead of stored codes.
  onNext: (
    values: PersonalDetailsValues,
    labels: Record<string, string>,
  ) => void;

  token: string | null;
  // Last 4 digits of the verified Aadhaar number — captured back in the
  // Aadhaar step (not in this form), so it's passed down for the Section 1
  // payload (`aadhaar_last4`).
  aadhaarLast4?: string;
};

function PersonalDetailsScreen({
  defaultValues,
  options,
  onNext,
  token,
  aadhaarLast4,
}: Props) {
  const { control, handleSubmit, setValue, getValues } =
    useForm<PersonalDetailsValues>({
      resolver: zodResolver(personalDetailsSchema),
      defaultValues: { ...initialValues, ...defaultValues },
    });

  // Prefer the API-provided options for a field; fall back to the static list
  // when the master list hasn't loaded yet (or doesn't cover that field).
  const opt = (key: keyof MasterOptions, fallback: SelectOption[]) =>
    optionsFor(options, key, fallback);

  // Fields that drive auto-calculated values. useWatch re-renders only this
  // component when they change (not the whole form tree).
  const areaInAcres = useWatch({ control, name: 'location.areaInAcres' });
  const selectedPumpCapacity = useWatch({ control, name: 'pumpCapacity' });
  const hasExistingPump =
    useWatch({ control, name: 'beneficiaryExistingPump' }) === 'yes';

  // District → taluka/village/block option lists for both address sections.
  const cascade = useLocationCascade(control);
  const {
    resTalukas,
    resVillages,
    resBlocks,
    locTalukas,
    locVillages,
    locBlocks,
  } = cascade;

  // Auto-save: each section persists on its own once it passes validation.
  // `saving` disables the continue button while a section PUT is in flight.
  const { saving } = useSectionAutosave({
    control,
    getValues,
    token,
    buildLabelMap: () => buildLabelMap(options, cascade),
    aadhaarLast4,
  });

  // Area in SqMtr is derived from acres and shown read-only. Blank acres ->
  // blank SqMtr so the field doesn't show "0" before the user types.
  useEffect(() => {
    const acres = parseFloat(areaInAcres ?? '');
    const sqMtr = Number.isNaN(acres)
      ? ''
      : (acres * SQMTR_PER_ACRE).toFixed(2);
    setValue('location.areaInSqMtr', sqMtr);
  }, [areaInAcres, setValue]);

  // Farmer contribution (INR) is auto-filled from the selected pump capacity.
  useEffect(() => {
    setValue(
      'farmerContribution',
      PUMP_CAPACITY_CONTRIBUTION[selectedPumpCapacity ?? ''] ?? '',
    );
  }, [selectedPumpCapacity, setValue]);

  // The button no longer triggers saving — sections persist automatically as
  // they pass validation. handleSubmit gates this on the whole form being valid,
  // so the press just advances to the next step once everything is filled in.
  const submit = (values: PersonalDetailsValues) =>
    onNext(values, buildLabelMap(options, cascade));

  return (
    <View className="my-4">
      <StepIndicator current={2} />

      {/* PERSONAL DETAILS -> section: 1*/}
      <FormSection title="Personal Details" icon="person-outline">
        <FormSelect
          control={control}
          name="applicationCategory"
          label="Application Category"
          required
          options={opt('applicationCategory', APPLICATION_CATEGORY)}
          placeholder="Please Select Application Category"
        />
        <FormInput
          control={control}
          name="applicantName"
          label="Name Of Applicant"
          required
          placeholder="Agast Panday"
        />
        <FormInput
          control={control}
          name="fatherName"
          label="Father/Husband Name"
          required
          placeholder="Jagdish Panday"
        />
        <FormSelect
          control={control}
          name="applicantCategory"
          label="Applicant Category"
          required
          options={opt('applicantCategory', APPLICANT_CATEGORY)}
          placeholder="Please Select Applicant Category"
        />
        <FormSelect
          control={control}
          name="gender"
          label="Select Gender"
          required
          options={opt('gender', GENDER)}
        />
        <FormInput
          control={control}
          name="mobile"
          label="Mobile No"
          required
          placeholder="98XXXXXX12"
          keyboardType="phone-pad"
          maxLength={10}
        />
        <FormInput
          control={control}
          name="email"
          label="Email Address"
          placeholder="Enter your Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </FormSection>

      {/* RESIDENTIAL ADDRESS -> section: 2*/}
      <FormSection title="Residential Address" icon="home-outline">
        <FormSelect
          control={control}
          name="residential.state"
          label="Select State"
          required
          options={STATES}
          disabled
        />
        <FormSelect
          control={control}
          name="residential.district"
          label="Select District"
          required
          options={opt('district', DISTRICTS)}
          placeholder="Please Select District"
        />
        <FormSelect
          control={control}
          name="residential.taluka"
          label="Select Taluka"
          required
          options={resTalukas.length ? resTalukas : TALUKAS}
          placeholder="Please Select Taluka"
        />
        <FormSelect
          control={control}
          name="residential.village"
          label="Select Village/City"
          required
          options={resVillages.length ? resVillages : VILLAGES}
        />
        <FormSelect
          control={control}
          name="residential.block"
          label="Select Block"
          required
          options={resBlocks.length ? resBlocks : BLOCKS}
          placeholder="Please Select Block"
        />
        <FormInput
          control={control}
          name="residential.panchayat"
          label="Panchayat Name"
          required
          placeholder="Please Enter Panchayat Name"
        />
        <FormInput
          control={control}
          name="residential.policeStation"
          label="Police Station Name"
          placeholder="Please Enter Police Station Name"
        />
        <FormInput
          control={control}
          name="residential.postOffice"
          label="Post Office Name"
          placeholder="Please Enter Post Office Name"
        />
        <FormInput
          control={control}
          name="residential.pinCode"
          label="Enter Pin Code"
          required
          placeholder="Please Enter Pin Code"
          keyboardType="number-pad"
          maxLength={6}
        />
      </FormSection>

      {/* PUMP DETAILS -> section: 3*/}
      <FormSection title="Pump Details" icon="water-outline">
        <FormSelect
          control={control}
          name="beneficiaryExistingPump"
          label="Beneficiary Existing Pump"
          required
          options={YES_NO}
        />

        {/* Existing-pump details — revealed only when the beneficiary already
            has a pump. Asterisks mark the mandatory ones; Generation is not. */}
        {hasExistingPump && (
          <>
            <FormSelect
              control={control}
              name="existingPumpCapacity"
              label="Pump Capacity"
              required
              options={opt('pumpCapacity', EXISTING_PUMP_CAPACITY)}
              placeholder="Please Select"
            />
            <FormSelect
              control={control}
              name="existingPumpType"
              label="Types of Existing Pump Subtype"
              required
              options={opt('pumpType', EXISTING_PUMP_TYPE)}
              placeholder="Please Select"
            />
            <FormSelect
              control={control}
              name="existingPumpSubType"
              label="Types of Existing Pump Subtype"
              required
              options={opt('pumpSubType', EXISTING_PUMP_SUBTYPE)}
              placeholder="Please Select"
            />
            <FormSelect
              control={control}
              name="pumpCategory"
              label="Pump Category"
              required
              options={opt('pumpCategory', PUMP_CATEGORY)}
              placeholder="Please Select"
            />
            <FormSelect
              control={control}
              name="generation"
              label="Select Generation"
              options={YES_NO}
              placeholder="Please Select"
            />
            <FormSelect
              control={control}
              name="pumpFuel"
              label="Fuel the Pump is Working"
              required
              options={opt('pumpFuel', PUMP_FUEL)}
              placeholder="Please Select"
            />
          </>
        )}
      </FormSection>

      {/* LOCATION ADDRESS -> section: 4*/}
      <FormSection title="Location Address" icon="location-outline">
        <FormSelect
          control={control}
          name="location.state"
          label="Select State"
          required
          options={STATES}
          disabled
        />
        <FormSelect
          control={control}
          name="location.district"
          label="Select District"
          required
          options={opt('district', DISTRICTS)}
          placeholder="Please Select District"
        />
        <FormSelect
          control={control}
          name="location.taluka"
          label="Select Taluka"
          required
          options={locTalukas.length ? locTalukas : TALUKAS}
          placeholder="Please Select Taluka"
        />
        <FormSelect
          control={control}
          name="location.village"
          label="Select Village/City"
          required
          options={locVillages.length ? locVillages : VILLAGES}
        />
        <FormSelect
          control={control}
          name="location.block"
          label="Select Block"
          required
          options={locBlocks.length ? locBlocks : BLOCKS}
          placeholder="Please Select Block"
        />
        <FormInput
          control={control}
          name="location.panchayat"
          label="Panchayat Name"
          required
          placeholder="Please Enter Panchayat Name"
        />
        <FormInput
          control={control}
          name="location.policeStation"
          label="Police Station Name"
          placeholder="Please Enter Police Station Name"
        />
        <FormInput
          control={control}
          name="location.postOffice"
          label="Post Office Name"
          placeholder="Please Enter Post Office Name"
        />
        <FormInput
          control={control}
          name="location.pinCode"
          label="Enter Pin Code"
          required
          placeholder="Please Enter Pin Code"
          keyboardType="number-pad"
          maxLength={6}
        />
        <FormInput
          control={control}
          name="location.areaInAcres"
          label="Area Of Land In Acres"
          required
          placeholder="Area of Land in Acres"
          keyboardType="decimal-pad"
        />
        <FormInput
          control={control}
          name="location.areaInSqMtr"
          label="Area Of Land In SqMtr"
          required
          placeholder="Auto-calculated from acres"
          keyboardType="decimal-pad"
          disabled
        />
        <FormDate
          control={control}
          name="location.lagaanRasidDate"
          label="Last Date Of Lagaan Rasid/Rent Receipt Of Land"
          required
          placeholder="Please Select Date"
          maximumDate={new Date()}
        />
      </FormSection>

      {/* REQUIRED PUMP DETAILS -> section: 5*/}
      <FormSection title="Required Pump Details" icon="construct-outline">
        <FormSelect
          control={control}
          name="pumpCapacity"
          label="Pump Capacity"
          required
          options={opt('pumpCapacity', PUMP_CAPACITY)}
          placeholder="Please Select Pump Capacity"
        />
        <FormSelect
          control={control}
          name="pumpType"
          label="Pump Type"
          required
          options={opt('pumpType', PUMP_TYPE)}
          placeholder="Please Select Pump Type"
        />
        <FormSelect
          control={control}
          name="pumpSubType"
          label="Pump Sub Type"
          required
          options={opt('pumpSubType', PUMP_SUB_TYPE)}
          placeholder="Please Select Pump Sub Type"
        />
        <FormSelect
          control={control}
          name="controllerType"
          label="Controller Type"
          required
          options={opt('controllerType', CONTROLLER_TYPE)}
          placeholder="Please Select Controller Type"
        />
        <FormInput
          control={control}
          name="farmerContribution"
          label="Pump Capacity (INR)"
          required
          placeholder="Auto-filled from Pump Capacity"
          keyboardType="decimal-pad"
          disabled
        />
      </FormSection>

      {/* IRRIGATION DETAILS -> section: 6*/}
      <FormSection title="Irrigation Details" icon="leaf-outline">
        <FormSelect
          control={control}
          name="cropTypeLast"
          label="Crop Type (Last Year)"
          options={opt('cropType', CROP_TYPE)}
        />
        <FormInput
          control={control}
          name="cropCountLast"
          label="Crop Count (Last Year)"
          placeholder="No. of Crops in previous year"
          keyboardType="number-pad"
        />
        <FormSelect
          control={control}
          name="cropTypeLastToLast"
          label="Crop Type (Last To Last Year)"
          options={opt('cropType', CROP_TYPE)}
        />
        <FormInput
          control={control}
          name="cropCountLastToLast"
          label="Crop Count (Last To Last Year)"
          placeholder="No. of Crops in previous year"
          keyboardType="number-pad"
        />
        <FormSelect
          control={control}
          name="sourceOfIrrigation"
          label="Source Of Irrigation"
          required
          options={opt('sourceOfIrrigation', SOURCE_OF_IRRIGATION)}
        />
        <FormSelect
          control={control}
          name="sourceOfWater"
          label="Source Of Water"
          required
          options={opt('sourceOfWater', SOURCE_OF_WATER)}
        />
      </FormSection>

      {/* Note */}
      <View className="flex-row items-start bg-[#FFF8E1] border border-[#F4D58D] rounded-xl p-3 mb-4">
        <Ionicons name="information-circle-outline" size={18} color="#B45309" />
        <Text className="text-[#B45309] text-[12px] ml-2 flex-1 leading-5">
          Note: Registration will be completed only after successful payment.
        </Text>
      </View>

      {/* Saving happens automatically per section; the button only advances —
          disabled while a section save is in flight. */}
      <Button
        title="Save and Continue"
        onPress={handleSubmit(submit)}
        disabled={saving}
        loading={saving}
        className="bg-[#1382F5] py-3"
        textClassName="text-[18px]"
      />
    </View>
  );
}

export default PersonalDetailsScreen;
