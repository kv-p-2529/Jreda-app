import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import { shadowSm } from '@/utils/shadows';
import {
  DocumentsValues,
  documentsSchema,
} from './registrationSchemas';

// Step 3 — document upload. The upload itself is mocked: tapping a tile sets
// the field to "uploaded.jpg" (a sentinel string) so the rhf form considers
// it filled. When the file-picker integration lands, replace the onPress
// with the actual picker and store the returned URI/file name.

type DocConfig = {
  key: keyof DocumentsValues;
  icon: string;
  title: string;
  hint: string;
};

const DOCS: DocConfig[] = [
  {
    key: 'addressProof',
    icon: 'card-outline',
    title: 'Address Proof (Aadhaar/VoterID/Ration Card)',
    hint: 'JPG, JPEG, PDF - Max size: 300 KB',
  },
  {
    key: 'landLagaanRasid',
    icon: 'document-outline',
    title: 'Land Lagaan Rasid',
    hint: 'JPG, JPEG, PDF - Max size: 300 KB',
  },
  {
    key: 'signature',
    icon: 'create-outline',
    title: 'Signature/Thumb Impression Of Beneficiary',
    hint: 'JPG, JPEG, PDF - Max size: 300 KB',
  },
  {
    key: 'photograph',
    icon: 'camera-outline',
    title: 'Photograph Of The Applicant/Applicants With Source Of Water',
    hint: 'JPG, JPEG - Max size: 5 Mb',
  },
];

type Props = {
  defaultValues?: Partial<DocumentsValues>;
  onNext: (values: DocumentsValues) => void;
  onBack: () => void;
};

function DocumentsScreen({ defaultValues, onNext, onBack }: Props) {
  const { control, handleSubmit } = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {
      addressProof: '',
      landLagaanRasid: '',
      signature: '',
      photograph: '',
      ...defaultValues,
    },
  });

  return (
    <View className="my-4">
      <StepIndicator current={3} />

      <View className="bg-white rounded-2xl p-5 mb-6" style={shadowSm}>
        <Text className="text-[22px] font-bold text-[#1B1B1B] mb-5">
          List of Documents
        </Text>

        {DOCS.map(doc => (
          <Controller
            key={doc.key}
            control={control}
            name={doc.key}
            render={({ field, fieldState }) => {
              const filename = field.value;
              const hasError = !!fieldState.error;
              const borderColor = filename
                ? '#16A34A'
                : hasError
                ? '#EF4444'
                : '#1382F5';
              const bgColor = filename
                ? '#F0FDF4'
                : hasError
                ? '#FEF2F2'
                : '#FFFFFF';
              return (
                <View className="mb-5">
                  <View className="flex-row items-start mb-3">
                    <View className="w-9 h-9 rounded-full bg-[#E8F1FF] items-center justify-center mr-3">
                      <Ionicons
                        name={doc.icon as any}
                        size={18}
                        color="#1382F5"
                      />
                    </View>
                    <Text className="text-[#1B1B1B] text-[15px] font-semibold flex-1 leading-6">
                      {doc.title} <Text className="text-red-500">*</Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      field.onChange(filename ? '' : 'uploaded.jpg')
                    }
                    style={{
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor,
                      borderRadius: 12,
                      paddingVertical: 18,
                      paddingHorizontal: 16,
                      alignItems: 'center',
                      backgroundColor: bgColor,
                    }}
                  >
                    <Ionicons
                      name={
                        filename
                          ? 'checkmark-circle-outline'
                          : 'cloud-upload-outline'
                      }
                      size={26}
                      color={filename ? '#16A34A' : '#1382F5'}
                    />
                    <Text
                      className="font-bold mt-1"
                      style={{
                        color: filename ? '#16A34A' : '#1B1B1B',
                      }}
                    >
                      {filename ? filename : 'Click to Upload'}
                    </Text>
                    <Text className="text-[#888] text-[12px] mt-0.5">
                      {doc.hint}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ))}
      </View>

      <Button
        title="Continue to Preview"
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

export default DocumentsScreen;
