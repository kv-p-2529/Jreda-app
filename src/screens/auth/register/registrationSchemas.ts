import { z } from 'zod';

// Zod schemas + inferred types for every step of the registration flow.
// Each step's form uses one schema as its rhf resolver, so validation rules
// live here ONCE and the form components stay focused on layout.
// `addressSchema` is shared between residential and land address — extend it
// for land-specific fields (acres, etc.) rather than duplicating the eight
// common address fields.

export const aadhaarSchema = z.object({
  aadhaar: z
    .string()
    .min(12, 'Aadhaar number must be 12 digits')
    .max(12, 'Aadhaar number must be 12 digits')
    .regex(/^\d{12}$/, 'Only digits allowed'),
});
export type AadhaarValues = z.infer<typeof aadhaarSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, 'Enter 6-digit OTP')
    .max(6, 'Enter 6-digit OTP')
    .regex(/^\d{6}$/, 'Only digits allowed'),
});
export type OtpValues = z.infer<typeof otpSchema>;

const addressSchema = z.object({
  state: z.string().min(1, 'Required'),
  district: z.string().min(1, 'Required'),
  taluka: z.string().min(1, 'Required'),
  village: z.string().min(1, 'Required'),
  block: z.string().min(1, 'Required'),
  panchayat: z.string().min(1, 'Required'),
  policeStation: z.string().min(1, 'Required'),
  postOffice: z.string().min(1, 'Required'),
  pinCode: z
    .string()
    .min(6, 'Pin code must be 6 digits')
    .max(6, 'Pin code must be 6 digits')
    .regex(/^\d{6}$/, 'Only digits allowed'),
});

export const personalDetailsSchema = z.object({
  // Personal
  applicationCategory: z.string().min(1, 'Required'),
  applicantName: z.string().min(1, 'Required'),
  fatherName: z.string().min(1, 'Required'),
  applicantCategory: z.string().min(1, 'Required'),
  gender: z.string().min(1, 'Required'),
  mobile: z
    .string()
    .min(10, 'Enter 10-digit mobile')
    .regex(/^\+?\d[\d\s]+$/, 'Invalid mobile'),
  // Zod 4 prefers the top-level format checkers (z.email) over chained
  // .email() on z.string(). The .or(literal('')) lets the field stay empty
  // without failing validation — email is optional in this form.
  email: z.email('Invalid email').optional().or(z.literal('')),

  // Residential
  residential: addressSchema,

  // Pump
  beneficiaryExistingPump: z.string().min(1, 'Required'),

  // Location (land)
  location: addressSchema.extend({
    areaInAcres: z
      .string()
      .min(1, 'Required')
      .regex(/^\d+(\.\d+)?$/, 'Invalid number'),
    areaInSqMtr: z
      .string()
      .min(1, 'Required')
      .regex(/^\d+(\.\d+)?$/, 'Invalid number'),
    lagaanRasidDate: z.string().min(1, 'Required'),
  }),

  // Required pump
  pumpCapacity: z.string().min(1, 'Required'),
  pumpType: z.string().min(1, 'Required'),
  pumpSubType: z.string().min(1, 'Required'),
  controllerType: z.string().min(1, 'Required'),
  farmerContribution: z
    .string()
    .min(1, 'Required')
    .regex(/^\d+(\.\d+)?$/, 'Invalid amount'),

  // Irrigation
  cropTypeLast: z.string().min(1, 'Required'),
  cropCountLast: z.string().min(1, 'Required'),
  cropTypeLastToLast: z.string().min(1, 'Required'),
  cropCountLastToLast: z.string().min(1, 'Required'),
  sourceOfIrrigation: z.string().min(1, 'Required'),
  sourceOfWater: z.string().min(1, 'Required'),
});
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;

export const documentsSchema = z.object({
  addressProof: z.string().min(1, 'Upload required'),
  landLagaanRasid: z.string().min(1, 'Upload required'),
  signature: z.string().min(1, 'Upload required'),
  photograph: z.string().min(1, 'Upload required'),
});
export type DocumentsValues = z.infer<typeof documentsSchema>;

export const declarationSchema = z.object({
  detailsCorrect: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm the details are correct' }),
  }),
  paymentUnderstood: z.literal(true, {
    errorMap: () => ({
      message: 'You must accept the payment terms',
    }),
  }),
});
export type DeclarationValues = z.infer<typeof declarationSchema>;
