// src/components/BriefingCard.js
// The dark AI briefing panel at the top of the feed.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, font } from '../../theme';

function parseBold(text) {
  if (!text) return null;
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <Text key={i} style={styles.bold}>{p}</Text>
      : <Text key={i}>{p}</Text>
  );
}

export default function BriefingCard({ briefing, countryName }) {
  const text = briefing?.text ?? `Scanning ${countryName} for suppressed stories… 👀`;
  const storiesTracked = briefing?.storiesTracked ?? '—';
  const suppressed     = briefing?.suppressed ?? '—';
  const comments       = briefing?.comments ?? '—';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.dot} />
        <Text style={styles.label}>AI BRIEFING · just updated</Text>
      </View>
      <Text style={styles.text}>{parseBold(text)}</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statN}>{storiesTracked}</Text>
          <Text style={styles.statL}>stories tracked</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statN, { color: '#FF6B6B' }]}>{suppressed}</Text>
          <Text style={styles.statL}>suppressed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>7</Text>
          <Text style={styles.statL}>countries</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statN, { color: colors.green }]}>{comments}</Text>
          <Text style={styles.statL}>comments</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark,
    borderRadius: radius.lg,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  label: {
    fontSize: 10,
    fontWeight: font.bold,
    letterSpacing: 1.5,
    color: colors.green,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
    marginBottom: 14,
  },
  bold: { fontWeight: font.bold, color: colors.yellow },
  stats: { flexDirection: 'row', gap: 8 },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.sm,
    padding: 10,
  },
  statN: { fontSize: 20, fontWeight: font.bold, color: '#fff' },
  statL: { fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 1 },
});
