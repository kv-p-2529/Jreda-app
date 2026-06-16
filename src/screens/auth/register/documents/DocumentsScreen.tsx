import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Controller, DefaultValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  errorCodes,
  isErrorWithCode,
  pick,
} from '@react-native-documents/picker';
import Ionicons from '@react-native-vector-icons/ionicons';

import Button from '@/components/ui/Button';
import StepIndicator from '@/components/ui/StepIndicator';
import { shadowSm } from '@/utils/shadows';
import {
  DocumentsInput,
  DocumentsValues,
  PickedFile,
  documentsSchema,
} from '../registrationSchemas';

// Step 3 — document upload. Tapping a tile opens the native document picker
// (Storage Access Framework on Android, the document browser on iOS) so the
// beneficiary can pick a real file from their phone. We validate the MIME type
// and size against each tile's rules before storing the file on the form; the
// stored `uri` is what we'll POST once the upload endpoint is live.

const KB = 1024;
const MB = 1024 * KB;

type DocConfig = {
  key: keyof DocumentsValues;
  icon: string;
  title: string;
  hint: string;
  // MIME types accepted by this tile — passed to the picker AND re-checked on
  // the result, since some Android providers ignore the picker's type filter.
  accept: string[];
  acceptLabel: string;
  maxBytes: number;
  maxLabel: string;
};

const IMAGES = ['image/jpeg', 'image/png', 'image/jpg'];
const PDF = ['application/pdf']

const IMAGE_PDF = [...IMAGES, ...PDF];

const DOCS: DocConfig[] = [
  {
    key: 'addressProof',
    icon: 'card-outline',
    title: 'Address Proof (Aadhaar/VoterID/Ration Card)',
    hint: 'JPG, JPEG, PDF - Max size: 300 KB',
    accept: IMAGE_PDF,
    acceptLabel: 'JPG, JPEG or PDF',
    maxBytes: 300 * KB,
    maxLabel: '300 KB',
  },
  {
    key: 'landLagaanRasid',
    icon: 'document-outline',
    title: 'Land Lagaan Rasid',
    hint: 'JPG, JPEG, PDF - Max size: 300 KB',
    accept: IMAGE_PDF,
    acceptLabel: 'JPG, JPEG or PDF',
    maxBytes: 300 * KB,
    maxLabel: '300 KB',
  },
  {
    key: 'signature',
    icon: 'create-outline',
    title: 'Signature/Thumb Impression Of Beneficiary',
    hint: 'JPG, JPEG, PNG - Max size: 300 KB',
    accept: IMAGES,
    acceptLabel: 'JPG, JPEG or PNG',
    maxBytes: 300 * KB,
    maxLabel: '300 KB',
  },
  {
    key: 'photograph',
    icon: 'camera-outline',
    title: 'Photograph Of The Applicant/Applicants With Source Of Water',
    hint: 'JPG, JPEG, PNG - Max size: 2 Mb',
    accept: IMAGES,
    acceptLabel: 'JPG, JPEG, PNG',
    maxBytes: 2 * MB,
    maxLabel: '2 MB',
  },
];

type Props = {
  defaultValues?: Partial<DocumentsValues>;
  onNext: (values: DocumentsValues) => void;
  onBack: () => void;
};

function DocumentsScreen({ defaultValues, onNext, onBack }: Props) {
  const { control, handleSubmit } = useForm<DocumentsInput, any, DocumentsValues>({
    // resolver: zodResolver(documentsSchema),
    // rhf's DefaultValues is a DeepPartial that doesn't model `null` on object
    // fields, so we cast — the fields are genuinely `PickedFile | null` and the
    // schema's refine turns a still-null field into the "Upload required" error.
    defaultValues: {
      addressProof: null,
      landLagaanRasid: null,
      signature: null,
      photograph: null,
      ...defaultValues,
    } as DefaultValues<DocumentsInput>,
  });

  // Open the picker, validate the result against the tile's rules, and hand the
  // file back to rhf via `onChange`. Cancellation is a no-op; anything else
  // surfaces an alert so the user knows the upload didn't take.
  const pickDocument = async (
    doc: DocConfig,
    onChange: (file: PickedFile | null) => void,
  ) => {
    try {
      const [file] = await pick({ mode: 'import', type: doc.accept });

      if (file.type && !doc.accept.includes(file.type)) {
        Alert.alert(
          'Unsupported file',
          `Please select a ${doc.acceptLabel} file.`,
        );
        return;
      }

      if (file.size != null && file.size > doc.maxBytes) {
        Alert.alert(
          'File too large',
          `This file is over the ${doc.maxLabel} limit. Please choose a smaller file.`,
        );
        return;
      }

      onChange({
        uri: file.uri,
        name: file.name ?? 'document',
        type: file.type,
        size: file.size,
      });
    } catch (err) {
      // The user dismissing the picker isn't an error worth surfacing.
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert('Upload failed', 'Could not open that file. Please try again.');
    }
  };

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
              const file = field.value;
              const hasError = !!fieldState.error;
              const borderColor = file
                ? '#16A34A'
                : hasError
                  ? '#EF4444'
                  : '#1382F5';
              const bgColor = file
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
                    onPress={() => pickDocument(doc, field.onChange)}
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
                        file
                          ? 'checkmark-circle-outline'
                          : 'cloud-upload-outline'
                      }
                      size={26}
                      color={file ? '#16A34A' : '#1382F5'}
                    />
                    <Text
                      className="font-bold mt-1"
                      numberOfLines={1}
                      style={{ color: file ? '#16A34A' : '#1B1B1B' }}
                    >
                      {file ? file.name : 'Click to Upload'}
                    </Text>
                    <Text className="text-[#888] text-[12px] mt-0.5">
                      {doc.hint}
                    </Text>
                  </TouchableOpacity>

                  {file && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => field.onChange(null)}
                      className="flex-row items-center justify-center mt-2"
                    >
                      <Ionicons name="trash-outline" size={14} color="#EF4444" />
                      <Text className="text-[#EF4444] text-[13px] font-semibold ml-1">
                        Remove
                      </Text>
                    </TouchableOpacity>
                  )}
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
