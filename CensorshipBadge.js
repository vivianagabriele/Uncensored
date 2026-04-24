// src/components/CensorshipBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SCORE_COLORS = {
  low: '#2a7a2a',       // 1-3
  medium: '#7a5a0a',    // 4-6
  high: '#8a1a1a',      // 7-10
};

function scoreLevel(score) {
  if (score <= 3) return 'low';
  if (score <= 6) return 'medium';
  return 'high';
}

export default function CensorshipBadge({ sensitivityScore, censoredIn = [] }) {
  const level = scoreLevel(sensitivityScore ?? 1);
  const color = SCORE_COLORS[level];
  const hasCensorship = censoredIn.length > 0;

  return (
    <View style={styles.row}>
      {/* Sensitivity score */}
      <View style={[styles.badge, { backgroundColor: color + '33', borderColor: color }]}>
        <Text style={[styles.badgeText, { color }]}>
          🔥 {sensitivityScore ?? '?'}/10
        </Text>
      </View>

      {/* Censored in countries */}
      {hasCensorship && (
        <View style={styles.censorBadge}>
          <Text style={styles.censorText}>
            🚫 Blocked in {censoredIn.slice(0, 2).join(', ')}
            {censoredIn.length > 2 ? ` +${censoredIn.length - 2}` : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  censorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#2a0a0a',
    borderWidth: 1,
    borderColor: '#5a1a1a',
  },
  censorText: {
    fontSize: 11,
    color: '#cc4444',
    fontWeight: '600',
  },
});
