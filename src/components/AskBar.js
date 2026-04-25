// src/components/AskBar.js
// The AI ask bar at the top — freeform question input with quick-tap chips.

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { colors, radius, font } from '../../theme';
import { askQuestion } from '../api/perplexity';

const QUICK_CHIPS = [
  { label: '🇨🇳 what\'s censored rn', q: 'What is being censored in China right now?' },
  { label: '🔥 most suppressed today', q: 'What is the most suppressed story in the world today?' },
  { label: '🆚 US vs Russia coverage', q: 'How does US and Russia news coverage differ on current events?' },
  { label: '👻 missing from state media', q: 'What major stories are completely missing from state media right now?' },
];

export default function AskBar() {
  const [query, setQuery]     = useState('');
  const [answer, setAnswer]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function submit(q) {
    const text = q || query.trim();
    if (!text) return;
    setLoading(true);
    setAnswer(null);
    setError(null);
    try {
      const res = await askQuestion(text);
      setAnswer(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function parseBold(text) {
    if (!text) return null;
    const parts = text.split(/\*\*(.+?)\*\*/g);
    return parts.map((p, i) =>
      i % 2 === 1
        ? <Text key={i} style={styles.bold}>{p}</Text>
        : <Text key={i}>{p}</Text>
    );
  }

  return (
    <View>
      {/* Input row */}
      <View style={styles.bar}>
        <Text style={styles.spark}>✦</Text>
        <TextInput
          style={styles.input}
          placeholder="ask anything — what's blocked in Iran rn?"
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => submit()}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.goBtn} onPress={() => submit()}>
            <Text style={styles.goBtnText}>Go</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {QUICK_CHIPS.map((c, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => submit(c.q)} activeOpacity={0.7}>
            <Text style={styles.chipText}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Answer panel */}
      {loading && (
        <View style={styles.answerBox}>
          <ActivityIndicator size="small" color={colors.green} />
          <Text style={styles.answerLoading}>thinking…</Text>
        </View>
      )}
      {error && (
        <View style={styles.answerBox}>
          <Text style={styles.answerError}>{error}</Text>
        </View>
      )}
      {answer && !loading && (
        <View style={styles.answerBox}>
          <View style={styles.answerHeader}>
            <View style={styles.aiDot} />
            <Text style={styles.aiLabel}>AI ANSWER</Text>
          </View>
          <Text style={styles.answerText}>{parseBold(answer.answer)}</Text>
          {answer.relatedCountries?.length > 0 && (
            <View style={styles.countryRow}>
              {answer.relatedCountries.map((c, i) => (
                <View key={i} style={styles.countryTag}>
                  <Text style={styles.countryTagText}>{c}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  spark: { fontSize: 15 },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    fontFamily: 'System',
  },
  goBtn: {
    backgroundColor: colors.dark,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  goBtnText: { color: '#fff', fontSize: 12, fontWeight: font.bold },
  chips: { paddingBottom: 12, gap: 6 },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  chipText: { fontSize: 11, fontWeight: font.semibold, color: '#555' },
  answerBox: {
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 12,
    gap: 8,
  },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  aiLabel: { fontSize: 10, fontWeight: font.bold, letterSpacing: 1.5, color: colors.green, textTransform: 'uppercase' },
  answerText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 20 },
  bold: { fontWeight: font.bold, color: colors.yellow },
  answerLoading: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' },
  answerError: { fontSize: 13, color: '#FF6B6B' },
  countryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 },
  countryTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  countryTagText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: font.medium },
});
