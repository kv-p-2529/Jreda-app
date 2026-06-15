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
  // Police Station & Post Office are optional — empty string is valid.
  policeStation: z.string().optional(),
  postOffice: z.string().optional(),
  pinCode: z
    .string()
    .min(6, 'Pin code must be 6 digits')
    .max(6, 'Pin code must be 6 digits')
    .regex(/^\d{6}$/, 'Only digits allowed'),
});

// Base object (no cross-field rules). Kept separate from `personalDetailsSchema`
// so individual sections can be validated in isolation via `.pick(...)` — the
// auto-save (see `isSectionValid`) leans on this. The superRefine that makes the
// existing-pump fields conditionally required is layered on below.
const personalDetailsBase = z.object({
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

  // Existing-pump details — only required when beneficiaryExistingPump === 'yes'
  // (enforced in the superRefine below). Optional at the field level so the
  // form validates fine when the user has no existing pump.
  existingPumpCapacity: z.string().optional(),
  existingPumpType: z.string().optional(),
  existingPumpSubType: z.string().optional(),
  pumpCategory: z.string().optional(),
  generation: z.string().optional(), // never required (no asterisk in UI)
  pumpFuel: z.string().optional(),

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

  // Irrigation — only Source of Irrigation & Source of Water are mandatory;
  // the crop type/count fields are optional.
  cropTypeLast: z.string().optional(),
  cropCountLast: z.string().optional(),
  cropTypeLastToLast: z.string().optional(),
  cropCountLastToLast: z.string().optional(),
  sourceOfIrrigation: z.string().min(1, 'Required'),
  sourceOfWater: z.string().min(1, 'Required'),
});

// Existing-pump fields are required only when the beneficiary has a pump
// (Generation stays optional — no asterisk in the UI). Reused by both the full
// form schema and the section-3 validation in `isSectionValid`.
const requireExistingPumpFields = (
  data: { beneficiaryExistingPump?: string } & Record<string, unknown>,
  ctx: z.RefinementCtx,
) => {
  if (data.beneficiaryExistingPump === 'yes') {
    const requiredWhenYes = [
      'existingPumpCapacity',
      'existingPumpType',
      'existingPumpSubType',
      'pumpCategory',
      'pumpFuel',
    ] as const;
    requiredWhenYes.forEach(key => {
      if (!data[key]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: [key],
        });
      }
    });
  }
};

export const personalDetailsSchema =
  personalDetailsBase.superRefine(requireExistingPumpFields);
export type PersonalDetailsValues = z.infer<typeof personalDetailsSchema>;

// Which form fields belong to each backend section (1–6). Used by the auto-save
// to validate one section at a time — a section is saved only once its fields
// pass validation. Keys must stay in sync with the section spec / payload
// builder in PersonalDetailsScreen.
const SECTION_FIELD_KEYS = {
  1: [
    'applicationCategory',
    'applicantName',
    'fatherName',
    'applicantCategory',
    'gender',
    'mobile',
    'email',
  ],
  2: ['residential'],
  3: [
    'beneficiaryExistingPump',
    'existingPumpCapacity',
    'existingPumpType',
    'existingPumpSubType',
    'pumpCategory',
    'generation',
    'pumpFuel',
  ],
  4: ['location'],
  5: [
    'pumpCapacity',
    'pumpType',
    'pumpSubType',
    'controllerType',
    'farmerContribution',
  ],
  6: [
    'cropTypeLast',
    'cropCountLast',
    'cropTypeLastToLast',
    'cropCountLastToLast',
    'sourceOfIrrigation',
    'sourceOfWater',
  ],
} as const satisfies Record<number, readonly (keyof PersonalDetailsValues)[]>;

export type SectionNumber = keyof typeof SECTION_FIELD_KEYS;
export const SECTION_NUMBERS = Object.keys(SECTION_FIELD_KEYS).map(
  Number,
) as SectionNumber[];

// True when the given section's fields are all valid (no zod errors), so the
// caller can save just that section. Section 3 re-applies the existing-pump
// cross-field rule; the others are a plain field subset of the base schema.
export function isSectionValid(
  section: SectionNumber,
  values: PersonalDetailsValues,
): boolean {
  const mask = Object.fromEntries(
    SECTION_FIELD_KEYS[section].map(key => [key, true]),
  ) as { [K in keyof PersonalDetailsValues]?: true };

  const picked = personalDetailsBase.pick(mask);
  const schema =
    section === 3 ? picked.superRefine(requireExistingPumpFields) : picked;

  return schema.safeParse(values).success;
}

// A file picked from the device. `uri` is what we'll POST when the upload
// endpoint lands (a content:// uri on Android, file:// on iOS); `name`/`type`/
// `size` come straight off the document picker and drive the UI + validation.
export const pickedFileSchema = z.object({
  uri: z.string().min(1),
  name: z.string().min(1),
  type: z.string().nullable(),
  size: z.number().nullable(),
});
export type PickedFile = z.infer<typeof pickedFileSchema>;

// Each document is required: the field holds `null` until a file is picked, and
// the refine turns a still-null field into the "Upload required" error. We keep
// the field nullable (rather than non-optional) so rhf can seed `null` defaults.
const requiredDocument = pickedFileSchema
  .nullable()
  .refine((v): v is PickedFile => v != null, { message: 'Upload required' });

export const documentsSchema = z.object({
  addressProof: requiredDocument,
  landLagaanRasid: requiredDocument,
  signature: requiredDocument,
  photograph: requiredDocument,
});
// Input vs output differ here: the refine's type-guard narrows each field from
// `PickedFile | null` (the form's working state, `DocumentsInput`) down to a
// guaranteed `PickedFile` once validation passes (`DocumentsValues`, what every
// downstream consumer receives). rhf's useForm takes both as generics.
export type DocumentsInput = z.input<typeof documentsSchema>;
export type DocumentsValues = z.output<typeof documentsSchema>;

export const declarationSchema = z.object({
  detailsCorrect: z.literal(true, {
    error: 'You must confirm the details are correct',
  }),
  paymentUnderstood: z.literal(true, {
    error: 'You must accept the payment terms',
  }),
});
export type DeclarationValues = z.infer<typeof declarationSchema>;
