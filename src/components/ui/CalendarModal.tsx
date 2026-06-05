import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

// Self-contained month calendar in a modal. Presentational + reusable: it owns
// only the "which month am I looking at" state; the selected value is passed in
// and the chosen date is handed back via onSelect as an ISO `YYYY-MM-DD` string.
// Used by FormDate (registration form) and the Live Status date selector — keep
// the calendar logic here so there's a single implementation.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function parseISO(value?: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function formatDisplay(value?: string): string {
  const d = parseISO(value);
  if (!d) return '';
  return `${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

// Midnight copy, so date-only comparisons ignore the time component.
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

interface CalendarModalProps {
  visible: boolean;
  value?: string; // currently-selected ISO date
  onSelect: (iso: string) => void;
  onClose: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function CalendarModal({
  visible,
  value,
  onSelect,
  onClose,
  minimumDate,
  maximumDate,
}: CalendarModalProps) {
  const selected = parseISO(value);
  // First-of-month currently displayed. Re-synced to the selected value (or
  // today) every time the modal opens, so it never reopens on a stale month.
  const [viewDate, setViewDate] = useState(() => selected ?? new Date());

  useEffect(() => {
    if (visible) setViewDate(parseISO(value) ?? new Date());
  }, [visible, value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Leading blanks to align day 1 under its weekday, then the day numbers.
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isDisabled = (day: number) => {
    const d = new Date(year, month, day);
    if (maximumDate && d > startOfDay(maximumDate)) return true;
    if (minimumDate && d < startOfDay(minimumDate)) return true;
    return false;
  };

  const isSelected = (day: number) =>
    !!selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === day;

  const goMonth = (delta: number) =>
    setViewDate(new Date(year, month + delta, 1));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Two-Pressable backdrop: outer closes, inner swallows the tap. */}
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40 items-center justify-center px-6"
      >
        <Pressable
          onPress={e => e.stopPropagation()}
          className="w-full bg-white rounded-2xl overflow-hidden"
        >
          {/* Month navigation header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
            <TouchableOpacity
              onPress={() => goMonth(-1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={22} color="#1B1B1B" />
            </TouchableOpacity>
            <Text className="text-[16px] font-bold text-[#1B1B1B]">
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity
              onPress={() => goMonth(1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-forward" size={22} color="#1B1B1B" />
            </TouchableOpacity>
          </View>

          {/* Weekday labels */}
          <View className="flex-row px-2 pt-3">
            {WEEKDAYS.map(w => (
              <Text
                key={w}
                style={{ width: `${100 / 7}%` }}
                className="text-center text-[12px] text-[#6B7280] font-medium"
              >
                {w}
              </Text>
            ))}
          </View>

          {/* Day grid */}
          <View className="flex-row flex-wrap px-2 pb-3 pt-1">
            {cells.map((day, idx) => {
              if (day === null) {
                return (
                  <View
                    key={`b${idx}`}
                    style={{ width: `${100 / 7}%`, height: 42 }}
                  />
                );
              }
              const disabled = isDisabled(day);
              const sel = isSelected(day);
              return (
                <View
                  key={day}
                  style={{ width: `${100 / 7}%`, height: 42 }}
                  className="items-center justify-center"
                >
                  <TouchableOpacity
                    disabled={disabled}
                    activeOpacity={0.7}
                    onPress={() => onSelect(toISO(new Date(year, month, day)))}
                    className="items-center justify-center"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: sel ? '#1382F5' : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: disabled
                          ? '#C4C4C4'
                          : sel
                            ? '#FFFFFF'
                            : '#1B1B1B',
                        fontWeight: sel ? '700' : '400',
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
