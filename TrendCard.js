// src/components/TrendCard.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import CensorshipBadge from './CensorshipBadge';
import { fetchTrendDetail } from '../api/perplexity';

const CATEGORY_COLORS = {
  Politics:      '#4a6fa5',
  Tech:          '#4a8f6a',
  Economy:       '#8f6a4a',
  Society:       '#7a4a8f',
  Sports:        '#4a8f8f',
  Entertainment: '#8f4a6a',
  Health:        '#6a8f4a',
};

export default function TrendCard({ trend, rank }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const catColor = CATEGORY_COLORS[trend.category] ?? '#555';

  async function handleExpand() {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (detail) return; // already fetched
    setLoadingDetail(true);
    setDetailError(null);
    try {
      const d = await fetchTrendDetail(trend.title);
      setDetail(d);
    } catch (e) {
      setDetailError('Could not load details. Check your API key.');
    } finally {
      setLoadingDetail(false);
    }
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleExpand}
      activeOpacity={0.85}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.rankBadge, { backgroundColor: catColor + '22', borderColor: catColor }]}>
          <Text style={[styles.rankText, { color: catColor }]}>#{rank}</Text>
        </View>
        <View style={[styles.catPill, { backgroundColor: catColor + '22' }]}>
          <Text style={[styles.catText, { color: catColor }]}>{trend.category}</Text>
        </View>
        <Text style={styles.expandIcon}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{trend.title}</Text>

      {/* Summary */}
      <Text style={styles.summary}>{trend.summary}</Text>

      {/* Censorship badges */}
      <CensorshipBadge
        sensitivityScore={trend.sensitivityScore}
        censoredIn={trend.censoredIn ?? []}
      />

      {/* Expanded detail */}
      {expanded && (
        <View style={styles.detail}>
          <View style={styles.divider} />
          {loadingDetail && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color="#e85d26" />
              <Text style={styles.loadingText}>Fetching deeper analysis…</Text>
            </View>
          )}
          {detailError && <Text style={styles.errorText}>{detailError}</Text>}
          {detail && !detail.parseError && (
            <>
              <Text style={styles.detailText}>{detail.fullSummary}</Text>

              {detail.countriesSuppressing?.length > 0 && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>🚫 Suppressed in</Text>
                  <Text style={styles.infoValue}>
                    {detail.countriesSuppressing.join(' · ')}
                  </Text>
                </View>
              )}

              {detail.countriesReporting?.length > 0 && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>📡 Openly reported in</Text>
                  <Text style={styles.infoValue}>
                    {detail.countriesReporting.join(' · ')}
                  </Text>
                </View>
              )}

              {detail.whyCensored && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>💡 Why it's suppressed</Text>
                  <Text style={styles.infoValue}>{detail.whyCensored}</Text>
                </View>
              )}

              {detail.sources?.length > 0 && (
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>📰 Sources</Text>
                  <Text style={styles.infoValue}>{detail.sources.join(', ')}</Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#12121e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e1e30',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
  },
  catPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  expandIcon: {
    marginLeft: 'auto',
    color: '#444',
    fontSize: 12,
  },
  title: {
    color: '#f0f0f8',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 6,
  },
  summary: {
    color: '#888',
    fontSize: 13,
    lineHeight: 19,
  },
  detail: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#1e1e30',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#666',
    fontSize: 13,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#cc4444',
    fontSize: 13,
  },
  detailText: {
    color: '#aaa',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoBlock: {
    marginBottom: 10,
  },
  infoLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 19,
  },
});
