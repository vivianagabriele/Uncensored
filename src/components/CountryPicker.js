// src/components/CountryPicker.js
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, radius, font } from '../theme';

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China',         flag: '🇨🇳' },
  { code: 'RU', name: 'Russia',        flag: '🇷🇺' },
  { code: 'IR', name: 'Iran',          flag: '🇮🇷' },
  { code: 'IN', name: 'India',         flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil',        flag: '🇧🇷' },
  { code: 'DE', name: 'Germany',       flag: '🇩🇪' },
  { code: 'GB', name: 'UK',            flag: '🇬🇧' },
  { code: 'MX', name: 'Mexico',        flag: '🇲🇽' },
  { code: 'NG', name: 'Nigeria',       flag: '🇳🇬' },
  { code: 'TR', name: 'Turkey',        flag: '🇹🇷' },
  { code: 'SA', name: 'Saudi Arabia',  flag: '🇸🇦' },
];

export default function CountryPicker({ selected, onSelect }) {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {COUNTRIES.map((c) => {
          const active = selected.code === c.code;
          return (
            <TouchableOpacity
              key={c.code}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onSelect(c)}
              activeOpacity={0.75}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <Text style={[styles.label, active && styles.labelActive]}>{c.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  scroll:  { paddingHorizontal: 12, gap: 6 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 100, borderWidth: 1.5,
    borderColor: '#ECEAE3', backgroundColor: '#FFFFFF',
  },
  pillActive: { backgroundColor: '#111111', borderColor: '#111111' },
  flag:  { fontSize: 14 },
  label: { fontSize: 12, fontWeight: '600', color: '#666666' },
  labelActive: { color: '#FFFFFF' },
});
