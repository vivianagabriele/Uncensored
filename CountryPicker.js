// src/components/CountryPicker.js
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
];

export default function CountryPicker({ selected, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {COUNTRIES.map((country) => {
          const isActive = selected.code === country.code;
          return (
            <TouchableOpacity
              key={country.code}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelect(country)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {country.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#2a2a3a',
    backgroundColor: '#12121e',
  },
  pillActive: {
    borderColor: '#e85d26',
    backgroundColor: '#1e0f08',
  },
  flag: {
    fontSize: 16,
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  labelActive: {
    color: '#e85d26',
  },
});
