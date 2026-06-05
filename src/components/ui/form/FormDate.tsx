import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import FormField, {
  ERROR_BG,
  ERROR_BORDER,
  NEUTRAL_BG,
  NEUTRAL_BORDER,
} from './FormField';
import CalendarModal, { formatDisplay, parseISO } from '@/components/ui/CalendarModal';

// rhf-bound date field. Renders a tappable box that opens the shared
// CalendarModal — no native datetimepicker dependency. The value is stored as
// an ISO `YYYY-MM-DD` string and shown to the user as `DD MMM YYYY`.

interface FormDateProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function FormDate<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder = 'Please Select Date',
  minimumDate,
  maximumDate,
}: FormDateProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [open, setOpen] = useState(false);

  const hasError = !!fieldState.error;
  const selected = parseISO(field.value);

  return (
    <FormField label={label} required={required}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
        style={{
          height: 46,
          backgroundColor: hasError ? ERROR_BG : NEUTRAL_BG,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: hasError ? ERROR_BORDER : NEUTRAL_BORDER,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 14, color: selected ? '#111111' : '#A0A0A0' }}>
          {selected ? formatDisplay(field.value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />
      </TouchableOpacity>

      <CalendarModal
        visible={open}
        value={field.value}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onClose={() => setOpen(false)}
        onSelect={iso => {
          field.onChange(iso);
          field.onBlur();
          setOpen(false);
        }}
      />
    </FormField>
  );
}
