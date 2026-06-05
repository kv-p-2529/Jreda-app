import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export type SearchByOption = {
  label: string;
  value: string;
};

interface SearchByCardProps {
  heading?: string;
  label?: string;
  options: SearchByOption[];
  defaultOption?: string;
  defaultQuery?: string;
  placeholder?: string;
  buttonTitle?: string;
  onSearch: (params: { optionValue: string; query: string }) => void;
}

export default function SearchByCard({
  label = 'Search By:',
  options,
  defaultOption,
  defaultQuery = '',
  placeholder,
  buttonTitle = 'SEARCH',
  onSearch,
}: SearchByCardProps) {
  const [selected, setSelected] = useState(
    defaultOption ?? options[0]?.value ?? '',
  );
  const [query, setQuery] = useState(defaultQuery);

  return (
    <View className="mx-4 mt-6">
      <View
        className="bg-[#F9FAFE] rounded-[20px]"
        style={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 18,
          borderColor: '#F1F1F2',
          borderWidth: 1,
        }}
      >
        <Text className="text-[#1B1B1B] text-[15px] font-bold mb-3">
          {label}
        </Text>

        {/* Radio options — omitted entirely when there are none (e.g. a single
            "Insurance Number" lookup field), so no empty gap is left behind. */}
        {options.length > 0 && (
          <View className="flex-row flex-wrap mb-4">
            {options.map(opt => {
              const checked = selected === opt.value;
              return (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.7}
                onPress={() => setSelected(opt.value)}
                className="flex-row items-center mr-6 mb-2"
              >
                <View
                  className="w-5 h-5 rounded-full items-center justify-center mr-2"
                  style={{
                    borderWidth: 2,
                    borderColor: checked ? '#1382F5' : '#9CA3AF',
                  }}
                >
                  {checked && (
                    <View
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: '#1382F5' }}
                    />
                  )}
                </View>
                  <Text className="text-[#1B1B1B] text-[14px]">
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Input */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder ?? 'Enter value'}
          placeholderTextColor="#A0A0A0"
          style={{
            height: 48,
            borderColor: '#F1F1F2',
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: '#ffffff',
            paddingHorizontal: 14,
            fontSize: 14,
            color: '#111111',
            marginBottom: 16,
          }}
        />

        {/* Search button */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onSearch({ optionValue: selected, query })}
          className="flex-row items-center justify-center rounded-full"
          style={{
            backgroundColor: '#1382F5',
            height: 50,
          }}
        >
          <Text className="text-white font-semibold text-[16px] tracking-wider mr-2">
            {buttonTitle}
          </Text>
          <View className="w-7 h-7 rounded-full bg-white/25 items-center justify-center">
            <Ionicons name="search" size={14} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
