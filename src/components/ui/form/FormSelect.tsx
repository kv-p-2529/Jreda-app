import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import FormField, {
  DISABLED_BG,
  ERROR_BG,
  ERROR_BORDER,
  NEUTRAL_BG,
  NEUTRAL_BORDER,
} from './FormField';

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  icon?: string;
  options: SelectOption[];
  placeholder?: string;
  // Locked selection (e.g. fixed State): can't be opened, shown dimmed.
  disabled?: boolean;
}

// rhf-bound dropdown rendered as a modal sheet so it works inside ScrollViews
// (a native Picker can be hard to position correctly inside a scrolling form).
export default function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  required,
  icon,
  options,
  placeholder = 'Please Select',
  disabled,
}: FormSelectProps<T>) {
  const { field, fieldState } = useController({ control, name });
  const [open, setOpen] = useState(false);
  const hasError = !!fieldState.error;

  // O(n) is fine — options lists here are short (dozens at most). If a
  // dropdown ever grows to hundreds of items, switch to a Map lookup.
  const selected = options.find(o => o.value === field.value);

  return (
    <FormField label={label} required={required} icon={icon}>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.85}
        disabled={disabled}
        onPress={() => {
          if (!disabled) setOpen(true);
        }}
        style={{
          height: 46,
          backgroundColor: disabled
            ? DISABLED_BG
            : hasError
            ? ERROR_BG
            : NEUTRAL_BG,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: hasError ? ERROR_BORDER : NEUTRAL_BORDER,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: disabled ? '#6B7280' : selected ? '#111111' : '#A0A0A0',
          }}
        >
          {selected ? selected.label : placeholder}
        </Text>
        {!disabled && (
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        )}
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* Outer Pressable closes on backdrop tap. Inner Pressable swallows
            the event with stopPropagation so tapping the sheet itself doesn't
            close it — classic two-Pressable modal pattern. */}
        <Pressable
          onPress={() => setOpen(false)}
          className="flex-1 bg-black/40 items-center justify-center px-6"
        >
          <Pressable
            onPress={e => e.stopPropagation()}
            className="w-full bg-white rounded-2xl overflow-hidden"
            style={{ maxHeight: '70%' }}
          >
            {label && (
              <Text className="text-[16px] font-bold text-[#1B1B1B] px-5 pt-4 pb-2">
                {label}
              </Text>
            )}
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    field.onChange(item.value);
                    setOpen(false);
                  }}
                  className="px-5 py-3 border-b border-[#F0F0F0] flex-row items-center justify-between"
                >
                  <Text className="text-[14px] text-[#1B1B1B]">
                    {item.label}
                  </Text>
                  {field.value === item.value && (
                    <Ionicons name="checkmark" size={20} color="#16A34A" />
                  )}
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </FormField>
  );
}
