import React from 'react';
import { Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import FormInput from '@/components/ui/form/FormInput';
import FormSelect from '@/components/ui/form/FormSelect';
import FormDate from '@/components/ui/form/FormDate';
import FormSection from '@/components/ui/form/FormSection';

// Step 2 — the big form. Address fields appear twice (residential + land
// location) under different prefixes; we lean on rhf's nested-path support
// (`residential.state`, `location.state`) to keep schema and UI parallel.
//
// `personalDetailsSchema` is imported but the resolver is commented out
// below — useful during layout iteration so the user doesn't have to fill
// every field to test navigation. Re-enable before shipping.
import {
  PersonalDetailsValues,
  personalDetailsSchema,
} from './registrationSchemas';
import {
  APPLICANT_CATEGORY,
  APPLICATION_CATEGORY,
  BLOCKS,
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
  TALUKAS,
  VILLAGES,
  YES_NO,
} from './registrationOptions';

type Props = {
  defaultValues?: Partial<PersonalDetailsValues>;
  onNext: (values: PersonalDetailsValues) => void;
};

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

const initialValues: PersonalDetailsValues = {
  applicationCategory: '',
  applicantName: '',
  fatherName: '',
  applicantCategory: '',
  gender: '',
  mobile: '',
  email: '',
  residential: { ...emptyAddress },
  beneficiaryExistingPump: '',
  location: {
    ...emptyAddress,
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
};

function PersonalDetailsScreen({ defaultValues, onNext }: Props) {
  const { control, handleSubmit } = useForm<PersonalDetailsValues>({
    // resolver: zodResolver(personalDetailsSchema),
    defaultValues: { ...initialValues, ...defaultValues },
  });

  return (
    <View className="my-4">
      <StepIndicator current={2} />

      {/* PERSONAL DETAILS */}
      <FormSection title="Personal Details" icon="person-outline">
        <FormSelect
          control={control}
          name="applicationCategory"
          label="Application Category"
          required
          options={APPLICATION_CATEGORY}
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
          options={APPLICANT_CATEGORY}
          placeholder="Please Select Applicant Category"
        />
        <FormSelect
          control={control}
          name="gender"
          label="Select Gender"
          required
          options={GENDER}
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

      {/* RESIDENTIAL ADDRESS */}
      <FormSection title="Residential Address" icon="home-outline">
        <FormSelect
          control={control}
          name="residential.state"
          label="Select State"
          required
          options={STATES}
        />
        <FormSelect
          control={control}
          name="residential.district"
          label="Select District"
          required
          options={DISTRICTS}
          placeholder="Please Select District"
        />
        <FormSelect
          control={control}
          name="residential.taluka"
          label="Select Taluka"
          required
          options={TALUKAS}
          placeholder="Please Select Taluka"
        />
        <FormSelect
          control={control}
          name="residential.village"
          label="Select Village/City"
          required
          options={VILLAGES}
        />
        <FormSelect
          control={control}
          name="residential.block"
          label="Select Block"
          required
          options={BLOCKS}
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
          required
          placeholder="Please Enter Police Station Name"
        />
        <FormInput
          control={control}
          name="residential.postOffice"
          label="Post Office Name"
          required
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

      {/* PUMP DETAILS */}
      <FormSection title="Pump Details" icon="water-outline">
        <FormSelect
          control={control}
          name="beneficiaryExistingPump"
          label="Beneficiary Existing Pump"
          required
          options={YES_NO}
        />
      </FormSection>

      {/* LOCATION ADDRESS */}
      <FormSection title="Location Address" icon="location-outline">
        <FormSelect
          control={control}
          name="location.state"
          label="Select State"
          required
          options={STATES}
        />
        <FormSelect
          control={control}
          name="location.district"
          label="Select District"
          required
          options={DISTRICTS}
          placeholder="Please Select District"
        />
        <FormSelect
          control={control}
          name="location.taluka"
          label="Select Taluka"
          required
          options={TALUKAS}
          placeholder="Please Select Taluka"
        />
        <FormSelect
          control={control}
          name="location.village"
          label="Select Village/City"
          required
          options={VILLAGES}
        />
        <FormSelect
          control={control}
          name="location.block"
          label="Select Block"
          required
          options={BLOCKS}
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
          required
          placeholder="Please Enter Police Station Name"
        />
        <FormInput
          control={control}
          name="location.postOffice"
          label="Post Office Name"
          required
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
          placeholder="Area of Land in SqMtr"
          keyboardType="decimal-pad"
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

      {/* REQUIRED PUMP DETAILS */}
      <FormSection title="Required Pump Details" icon="construct-outline">
        <FormSelect
          control={control}
          name="pumpCapacity"
          label="Pump Capacity"
          required
          options={PUMP_CAPACITY}
          placeholder="Please Select Pump Capacity"
        />
        <FormSelect
          control={control}
          name="pumpType"
          label="Pump Type"
          required
          options={PUMP_TYPE}
          placeholder="Please Select Pump Type"
        />
        <FormSelect
          control={control}
          name="pumpSubType"
          label="Pump Sub Type"
          required
          options={PUMP_SUB_TYPE}
          placeholder="Please Select Pump Sub Type"
        />
        <FormSelect
          control={control}
          name="controllerType"
          label="Controller Type"
          required
          options={CONTROLLER_TYPE}
          placeholder="Please Select Controller Type"
        />
        <FormInput
          control={control}
          name="farmerContribution"
          label="Pump Capacity"
          required
          placeholder="Farmer Contribution INR"
          keyboardType="decimal-pad"
        />
      </FormSection>

      {/* IRRIGATION DETAILS */}
      <FormSection title="Irrigation Details" icon="leaf-outline">
        <FormSelect
          control={control}
          name="cropTypeLast"
          label="Crop Type (Last Year)"
          required
          options={CROP_TYPE}
        />
        <FormInput
          control={control}
          name="cropCountLast"
          label="Crop Count (Last Year)"
          required
          placeholder="No. of Crops in previous year"
          keyboardType="number-pad"
        />
        <FormSelect
          control={control}
          name="cropTypeLastToLast"
          label="Crop Type (Last To Last Year)"
          required
          options={CROP_TYPE}
        />
        <FormInput
          control={control}
          name="cropCountLastToLast"
          label="Crop Count (Last To Last Year)"
          required
          placeholder="No. of Crops in previous year"
          keyboardType="number-pad"
        />
        <FormSelect
          control={control}
          name="sourceOfIrrigation"
          label="Source Of Irrigation"
          required
          options={SOURCE_OF_IRRIGATION}
        />
        <FormSelect
          control={control}
          name="sourceOfWater"
          label="Source Of Water"
          required
          options={SOURCE_OF_WATER}
        />
      </FormSection>

      {/* Note */}
      <View className="flex-row items-start bg-[#FFF8E1] border border-[#F4D58D] rounded-xl p-3 mb-4">
        <Ionicons name="information-circle-outline" size={18} color="#B45309" />
        <Text className="text-[#B45309] text-[12px] ml-2 flex-1 leading-5">
          Note: Registration will be completed only after successful payment.
        </Text>
      </View>

      <Button
        title="Save and Continue"
        onPress={handleSubmit(onNext)}
        className="bg-[#1382F5] py-3"
        textClassName="text-[18px]"
      />
    </View>
  );
}

export default PersonalDetailsScreen;
