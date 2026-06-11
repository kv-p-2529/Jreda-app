import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import Ionicons from '@react-native-vector-icons/ionicons';

import DashHOC from '@/components/DashHOC';
import Spacer from '@/components/ui/Spacer';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/form/FormInput';
import FormSelect from '@/components/ui/form/FormSelect';
import FormSection from '@/components/ui/form/FormSection';

// "Add Complaint" — the create form behind the Grievance screen's empty-state
// button. A single titled section of complaint fields + submit. Values are
// local-only for now; wire `onSubmit` to a createComplaint() mutation and pop
// back to Grievance once the API lands.

type ComplaintForm = {
  applicationNo: string;
  applicantName: string;
  mobile: string;
  complaintType: string;
  subject: string;
  description: string;
};

const COMPLAINT_TYPE = [
  { label: 'Pump Not Working', value: 'pump-not-working' },
  { label: 'Installation Delay', value: 'installation-delay' },
  { label: 'Payment Issue', value: 'payment-issue' },
  { label: 'Document Issue', value: 'document-issue' },
  { label: 'Other', value: 'other' },
];

const initialValues: ComplaintForm = {
  applicationNo: '',
  applicantName: '',
  mobile: '',
  complaintType: '',
  subject: '',
  description: '',
};

function AddComplaint() {
  const navigation = useNavigation<any>();
  const { control, handleSubmit } = useForm<ComplaintForm>({
    defaultValues: initialValues,
  });

  // Stubbed until the complaints API lands — persist, then return to the
  // Grievance list where the new record would appear.
  const onSubmit = (_values: ComplaintForm) => {
    navigation.goBack();
  };

  return (
    <DashHOC title="Add Complaint">
      <View className="my-4 mx-4">
        <FormSection title="Complaint Details" icon="megaphone-outline">
          <FormInput
            control={control}
            name="applicationNo"
            label="Application No"
            required
            placeholder="Enter Application No"
          />
          <FormInput
            control={control}
            name="applicantName"
            label="Applicant Name"
            required
            placeholder="Enter Applicant Name"
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
          <FormSelect
            control={control}
            name="complaintType"
            label="Complaint Type"
            required
            options={COMPLAINT_TYPE}
            placeholder="Please Select Complaint Type"
          />
          <FormInput
            control={control}
            name="subject"
            label="Subject"
            required
            placeholder="Brief subject of the complaint"
          />
          {/* FormInput spreads `...inputProps` after its own `style`, so a
              passed `style` fully replaces the input chrome — we re-state the
              neutral chrome here (no resolver, so the error state never shows)
              and add the taller multiline box. */}
          <FormInput
            control={control}
            name="description"
            label="Description"
            required
            placeholder="Describe the issue in detail"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              height: 110,
              backgroundColor: '#F5F5F5',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: 'transparent',
              paddingHorizontal: 14,
              paddingTop: 12,
              fontSize: 14,
              color: '#111111',
            }}
          />
        </FormSection>

        {/* Note */}
        <View className="flex-row items-start bg-[#FFF8E1] border border-[#F4D58D] rounded-xl p-3 mb-4">
          <Ionicons name="information-circle-outline" size={18} color="#B45309" />
          <Text className="text-[#B45309] text-[12px] ml-2 flex-1 leading-5">
            Note: You will receive a complaint number once the complaint is
            registered.
          </Text>
        </View>

        <Button
          title="Submit Complaint"
          onPress={handleSubmit(onSubmit)}
          className="bg-[#1382F5] py-3"
          textClassName="text-[18px]"
        />
      </View>
      <Spacer size="lg" />
    </DashHOC>
  );
}

export default AddComplaint;
