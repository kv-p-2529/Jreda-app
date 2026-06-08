import React from 'react';
import { Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import FormSection from '@/components/ui/form/FormSection';
import { shadowSm } from '@/utils/shadows';

import { Checkbox, DocumentRow, Row } from './PreviewRows';
import {
  DeclarationValues,
  DocumentsValues,
  PersonalDetailsValues,
  declarationSchema,
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
  getOptionLabel,
} from './registrationOptions';

// Step 4 — read-only review of everything captured so far, plus two
// declaration checkboxes the user must tick before proceeding to payment.
// Each FormSection's `onEdit` jumps back to the relevant step so the user
// can edit any field — we don't have per-section deep-linking yet.

type Props = {
  details: PersonalDetailsValues;
  documents: DocumentsValues;
  onEditDetails: () => void;
  onEditDocuments: () => void;
  onBack: () => void;
  onNext: () => void;
};

// Mirror of the document tiles from DocumentsScreen so the preview can show a
// human-readable label for each upload. Keep the keys in sync with
// `documentsSchema` — they drive which uploads we render.
const DOC_LABELS: { key: keyof DocumentsValues; label: string }[] = [
  { key: 'addressProof', label: 'Address Proof (Aadhaar/VoterID/Ration Card)' },
  { key: 'landLagaanRasid', label: 'Land Lagaan Rasid' },
  { key: 'signature', label: 'Signature/Thumb Impression Of Beneficiary' },
  { key: 'photograph', label: 'Photograph Of The Applicant With Source Of Water' },
];

function PreviewScreen({
  details,
  documents,
  onEditDetails,
  onEditDocuments,
  onBack,
  onNext,
}: Props) {
  // The declaration schema requires `true` literals — but rhf needs initial
  // values that aren't already-passing, otherwise the submit fires on first
  // tap without the user actually confirming. The `as unknown as true` cast
  // lets us seed false here without losing the literal-true type guarantee
  // at validation time. Don't simplify away the double cast — rhf's generics
  // narrow on defaultValues and will complain.
  const { control, handleSubmit } = useForm<DeclarationValues>({
    resolver: zodResolver(declarationSchema),
    defaultValues: {
      detailsCorrect: false as unknown as true,
      paymentUnderstood: false as unknown as true,
    },
  });

  // All the read-only detail cards are structurally identical (titled card +
  // a list of label/value rows), so we describe them as data and map over it
  // instead of hand-writing every <FormSection>/<Row>. Select-backed fields run
  // through getOptionLabel so the user sees labels, not stored values; the rest
  // are plain text. Every card edits the same step, so onEdit is onEditDetails.
  const detailSections: {
    title: string;
    icon: string;
    rows: { label: string; value?: string }[];
  }[] = [
    {
      title: 'Personal Details',
      icon: 'person-outline',
      rows: [
        {
          label: 'Application Category :',
          value: getOptionLabel(APPLICATION_CATEGORY, details.applicationCategory),
        },
        { label: 'Name Of Applicant :', value: details.applicantName },
        { label: 'Father/Husband Name :', value: details.fatherName },
        {
          label: 'Applicant Category :',
          value: getOptionLabel(APPLICANT_CATEGORY, details.applicantCategory),
        },
        { label: 'Select Gender :', value: getOptionLabel(GENDER, details.gender) },
        { label: 'Mobile No :', value: details.mobile },
        { label: 'Email Address :', value: details.email },
      ],
    },
    {
      title: 'Residential Address',
      icon: 'home-outline',
      rows: [
        { label: 'Select State :', value: getOptionLabel(STATES, details.residential.state) },
        { label: 'Select District :', value: getOptionLabel(DISTRICTS, details.residential.district) },
        { label: 'Select Taluka :', value: getOptionLabel(TALUKAS, details.residential.taluka) },
        { label: 'Select Village/City :', value: getOptionLabel(VILLAGES, details.residential.village) },
        { label: 'Select Block :', value: getOptionLabel(BLOCKS, details.residential.block) },
        { label: 'Panchayat Name :', value: details.residential.panchayat },
        { label: 'Police Station Name :', value: details.residential.policeStation },
        { label: 'Post Office Name :', value: details.residential.postOffice },
        { label: 'Enter Pin Code :', value: details.residential.pinCode },
      ],
    },
    {
      title: 'Pump Details',
      icon: 'water-outline',
      rows: [
        {
          label: 'Beneficiary Existing Pump *',
          value: getOptionLabel(YES_NO, details.beneficiaryExistingPump),
        },
      ],
    },
    {
      title: 'Location Address',
      icon: 'location-outline',
      rows: [
        { label: 'Select State :', value: getOptionLabel(STATES, details.location.state) },
        { label: 'Select District :', value: getOptionLabel(DISTRICTS, details.location.district) },
        { label: 'Select Taluka :', value: getOptionLabel(TALUKAS, details.location.taluka) },
        { label: 'Select Village/City :', value: getOptionLabel(VILLAGES, details.location.village) },
        { label: 'Select Block :', value: getOptionLabel(BLOCKS, details.location.block) },
        { label: 'Panchayat Name :', value: details.location.panchayat },
        { label: 'Police Station Name :', value: details.location.policeStation },
        { label: 'Post Office Name :', value: details.location.postOffice },
        { label: 'Enter Pin Code :', value: details.location.pinCode },
        { label: 'Area Of Land In Acres :', value: details.location.areaInAcres },
        { label: 'Area Of Land In SqMtr :', value: details.location.areaInSqMtr },
        {
          label: 'Laste Date Of Lagaan Rasid/Rent Receipt Of Land :',
          value: details.location.lagaanRasidDate,
        },
      ],
    },
    {
      title: 'Required Pump Details',
      icon: 'construct-outline',
      rows: [
        { label: 'Pump Capacity :', value: getOptionLabel(PUMP_CAPACITY, details.pumpCapacity) },
        { label: 'Pump Type :', value: getOptionLabel(PUMP_TYPE, details.pumpType) },
        { label: 'Pump Sub Type :', value: getOptionLabel(PUMP_SUB_TYPE, details.pumpSubType) },
        { label: 'Controller Type :', value: getOptionLabel(CONTROLLER_TYPE, details.controllerType) },
        { label: 'Pump Capacity :', value: details.farmerContribution },
      ],
    },
    {
      title: 'Irrigation Details',
      icon: 'leaf-outline',
      rows: [
        { label: 'Crop Type (Last Year) :', value: getOptionLabel(CROP_TYPE, details.cropTypeLast) },
        { label: 'Crop Count (Last Year) :', value: details.cropCountLast },
        { label: 'Crop Type (Last To Last Year) :', value: getOptionLabel(CROP_TYPE, details.cropTypeLastToLast) },
        { label: 'Crop Count (Last To Last Year) :', value: details.cropCountLastToLast },
        { label: 'Source Of Irrigation :', value: getOptionLabel(SOURCE_OF_IRRIGATION, details.sourceOfIrrigation) },
        { label: 'Source Of Water :', value: getOptionLabel(SOURCE_OF_WATER, details.sourceOfWater) },
      ],
    },
  ];

  return (
    <View className="my-4">
      <StepIndicator current={4} />

      {detailSections.map(section => (
        <FormSection
          key={section.title}
          title={section.title}
          icon={section.icon}
          onEdit={onEditDetails}
        >
          {section.rows.map(row => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
        </FormSection>
      ))}

      <FormSection
        title="Uploaded Documents"
        icon="folder-open-outline"
        onEdit={onEditDocuments}
      >
        {DOC_LABELS.map(doc => (
          <DocumentRow
            key={doc.key}
            label={doc.label}
            file={documents[doc.key]}
          />
        ))}
      </FormSection>

      {/* DECLARATION */}
      <View className="bg-white rounded-2xl p-4 mb-4" style={shadowSm}>
        <View className="flex-row items-center mb-3">
          <Ionicons name="shield-checkmark" size={20} color="#16A34A" />
          <Text className="text-[18px] font-bold text-[#1B1B1B] ml-2">
            Declaration
          </Text>
        </View>

        <Controller
          control={control}
          name="detailsCorrect"
          render={({ field, fieldState }) => (
            <Checkbox
              checked={!!field.value}
              onToggle={() => field.onChange(!field.value)}
              label="I Confirm That The Details Provided Are Correct."
              hasError={!!fieldState.error}
            />
          )}
        />
        <Controller
          control={control}
          name="paymentUnderstood"
          render={({ field, fieldState }) => (
            <Checkbox
              checked={!!field.value}
              onToggle={() => field.onChange(!field.value)}
              label="I Understand That Registration Will Be Completed Only After Successful Payment."
              hasError={!!fieldState.error}
            />
          )}
        />
      </View>

      <Button
        title="Proceed to Payment"
        onPress={handleSubmit(onNext)}
        className="bg-[#1382F5] py-3 mb-3"
        textClassName="text-[18px]"
      />

      <Button
        title="Back"
        onPress={onBack}
        variant="outline"
        className="border-2 border-[#1382F5] py-3"
        textClassName="text-[18px] text-[#1382F5]"
      />
    </View>
  );
}

export default PreviewScreen;
