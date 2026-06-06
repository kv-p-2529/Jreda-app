import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import FormSection from '@/components/ui/form/FormSection';
import { shadowSm } from '@/utils/shadows';

import {
  DeclarationValues,
  DocumentsValues,
  PersonalDetailsValues,
  PickedFile,
  declarationSchema,
} from './registrationSchemas';

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

function DocumentRow({
  label,
  file,
}: {
  label: string;
  file: PickedFile | null;
}) {
  const uploaded = !!file;
  return (
    <View className="flex-row items-center mb-3">
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
        style={{ backgroundColor: uploaded ? '#F0FDF4' : '#FEF2F2' }}
      >
        <Ionicons
          name={uploaded ? 'document-text-outline' : 'alert-circle-outline'}
          size={18}
          color={uploaded ? '#16A34A' : '#EF4444'}
        />
      </View>
      <View className="flex-1">
        <Text className="text-[#1B1B1B] text-[13px] font-semibold leading-5">
          {label}
        </Text>
        <Text
          className="text-[12px] mt-0.5"
          numberOfLines={1}
          style={{ color: uploaded ? '#16A34A' : '#EF4444' }}
        >
          {uploaded ? file.name : 'Not uploaded'}
        </Text>
      </View>
      {uploaded && (
        <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <View className="mb-3">
      <Text className="text-[#6B7280] text-[12px]">{label}</Text>
      <Text className="text-[#1B1B1B] text-[14px] font-semibold mt-0.5">
        {value || '-'}
      </Text>
    </View>
  );
}

function Checkbox({
  checked,
  onToggle,
  label,
  hasError,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  hasError?: boolean;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      className="flex-row items-start mb-3 p-2 rounded-lg"
      style={{
        backgroundColor: hasError ? '#FEF2F2' : 'transparent',
        borderWidth: hasError ? 1 : 0,
        borderColor: hasError ? '#EF4444' : 'transparent',
      }}
    >
      <View
        className="w-5 h-5 rounded items-center justify-center mt-0.5 mr-3"
        style={{
          backgroundColor: checked ? '#1382F5' : 'transparent',
          borderWidth: 1.5,
          borderColor: checked
            ? '#1382F5'
            : hasError
            ? '#EF4444'
            : '#9CA3AF',
        }}
      >
        {checked && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      <Text className="text-[#1B1B1B] text-[13px] flex-1 leading-5">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

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

  return (
    <View className="my-4">
      <StepIndicator current={4} />

      <FormSection
        title="Personal Details"
        icon="person-outline"
        onEdit={onEditDetails}
      >
        <Row
          label="Application Category :"
          value={details.applicationCategory}
        />
        <Row label="Name Of Applicant :" value={details.applicantName} />
        <Row label="Father/Husband Name :" value={details.fatherName} />
        <Row label="Applicant Category :" value={details.applicantCategory} />
        <Row label="Select Gender :" value={details.gender} />
        <Row label="Mobile No :" value={details.mobile} />
        <Row label="Email Address :" value={details.email || '-'} />
      </FormSection>

      <FormSection
        title="Residential Address"
        icon="home-outline"
        onEdit={onEditDetails}
      >
        <Row label="Select State :" value={details.residential.state} />
        <Row label="Select District :" value={details.residential.district} />
        <Row label="Select Taluka :" value={details.residential.taluka} />
        <Row
          label="Select Village/City :"
          value={details.residential.village}
        />
        <Row label="Select Block :" value={details.residential.block} />
        <Row label="Panchayat Name :" value={details.residential.panchayat} />
        <Row
          label="Police Station Name :"
          value={details.residential.policeStation}
        />
        <Row
          label="Post Office Name :"
          value={details.residential.postOffice}
        />
        <Row label="Enter Pin Code :" value={details.residential.pinCode} />
      </FormSection>

      <FormSection
        title="Pump Details"
        icon="water-outline"
        onEdit={onEditDetails}
      >
        <Row
          label="Beneficiary Existing Pump *"
          value={details.beneficiaryExistingPump}
        />
      </FormSection>

      <FormSection
        title="Location Address"
        icon="location-outline"
        onEdit={onEditDetails}
      >
        <Row label="Select State :" value={details.location.state} />
        <Row label="Select District :" value={details.location.district} />
        <Row label="Select Taluka :" value={details.location.taluka} />
        <Row
          label="Select Village/City :"
          value={details.location.village}
        />
        <Row label="Select Block :" value={details.location.block} />
        <Row label="Panchayat Name :" value={details.location.panchayat} />
        <Row
          label="Police Station Name :"
          value={details.location.policeStation}
        />
        <Row
          label="Post Office Name :"
          value={details.location.postOffice}
        />
        <Row label="Enter Pin Code :" value={details.location.pinCode} />
        <Row
          label="Area Of Land In Acres :"
          value={details.location.areaInAcres}
        />
        <Row
          label="Area Of Land In SqMtr :"
          value={details.location.areaInSqMtr}
        />
        <Row
          label="Laste Date Of Lagaan Rasid/Rent Receipt Of Land :"
          value={details.location.lagaanRasidDate}
        />
      </FormSection>

      <FormSection
        title="Required Pump Details"
        icon="construct-outline"
        onEdit={onEditDetails}
      >
        <Row label="Pump Capacity :" value={details.pumpCapacity} />
        <Row label="Pump Type :" value={details.pumpType} />
        <Row label="Pump Sub Type :" value={details.pumpSubType} />
        <Row label="Controller Type :" value={details.controllerType} />
        <Row label="Pump Capacity :" value={details.farmerContribution} />
      </FormSection>

      <FormSection
        title="Irrigation Details"
        icon="leaf-outline"
        onEdit={onEditDetails}
      >
        <Row label="Crop Type (Last Year) :" value={details.cropTypeLast} />
        <Row
          label="Crop Count (Last Year) :"
          value={details.cropCountLast}
        />
        <Row
          label="Crop Type (Last To Last Year) :"
          value={details.cropTypeLastToLast}
        />
        <Row
          label="Crop Count (Last To Last Year) :"
          value={details.cropCountLastToLast}
        />
        <Row
          label="Source Of Irrigation :"
          value={details.sourceOfIrrigation}
        />
        <Row label="Source Of Water :" value={details.sourceOfWater} />
      </FormSection>

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
