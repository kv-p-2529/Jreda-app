import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import FormField, {
  ERROR_BG,
  ERROR_BORDER,
  NEUTRAL_BG,
  NEUTRAL_BORDER,
} from './FormField';

// react-hook-form-bound text input. The generic <T> threads form value types
// through, so `name` is autocompleted to fields that exist on the form's
// schema instead of any string.

interface FormInputProps<T extends FieldValues>
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  icon?: string;
}

export default function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  required,
  icon,
  ...inputProps
}: FormInputProps<T>) {
  // useController subscribes only to this field's state — siblings can update
  // without re-rendering this input. That's the win over watch().
  const { field, fieldState } = useController({ control, name });
  const hasError = !!fieldState.error;

  return (
    <FormField label={label} required={required} icon={icon}>
      <TextInput
        value={field.value as string}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        placeholderTextColor="#A0A0A0"
        style={{
          height: 46,
          backgroundColor: hasError ? ERROR_BG : NEUTRAL_BG,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: hasError ? ERROR_BORDER : NEUTRAL_BORDER,
          paddingHorizontal: 14,
          fontSize: 14,
          color: '#111111',
        }}
        {...inputProps}
      />
    </FormField>
  );
}
