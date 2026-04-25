// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import CountryPicker, { COUNTRIES } from '../components/CountryPicker';
import TrendCard from '../components/TrendCard';
import BriefingCard from '../components/BriefingCard';
import AskBar from '../components/AskBar';
import { fetchTrends, fetchBriefing } from '../api/perplexity';
import { simpleCache } from '../utils/cache';
import { colors, radius, font } from '../theme';

const DEFAULT = COUNTRIES[0];

export default function HomeScreen() {
  const [country, setCountry]     = useState(DEFAULT);
  const [trends, setTrends]       = useState([]);
  const [briefing, setBriefing]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const load = useCallback(async (c, force = false) => {
    setLoading(true);
    setError(null);
    if (force) simpleCache.clear();
    try {
      const [t, b] = await Promise.all([
        fetchTrends(c.name, c.code),
        fetchBriefing(c.name, c.code),
      ]);
      setTrends(t);
      setBriefing(b);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleCountry(c) {
    setCountry(c);
    setTrends([]);
    setBriefing(null);
    load(c);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => load(country, true)} tintColor={colors.dark} />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.wordmarkRow}>
            <Text style={styles.wordmark}>TrendWatch</Text>
            <View style={styles.betaBadge}><Text style={styles.betaText}>BETA</Text></View>
          </View>
          <Text style={styles.headline}>What are they{'\n'}trying to hide? 👀</Text>
          <Text style={styles.sub}>Real stories. No filters. No BS.</Text>

          {/* Ask bar */}
          <AskBar />
        </View>

        {/* ── Country picker ── */}
        <CountryPicker selected={country} onSelect={handleCountry} />

        {/* ── Fetch CTA ── */}
        {trends.length === 0 && !loading && !error && (
          <TouchableOpacity style={styles.fetchBtn} onPress={() => load(country)} activeOpacity={0.85}>
            <Text style={styles.fetchBtnText}>
              load what's trending in {country.flag} {country.name}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Loading ── */}
        {loading && trends.length === 0 && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.dark} />
            <Text style={styles.loadingText}>scanning the open web…</Text>
          </View>
        )}

        {/* ── Error ── */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>⚠️ something went wrong</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            {error.includes('API key') && (
              <Text style={styles.errorHint}>→ copy .env.example to .env and add your Perplexity key</Text>
            )}
          </View>
        )}

        {/* ── Content ── */}
        {trends.length > 0 && (
          <>
            <BriefingCard briefing={briefing} countryName={`${country.flag} ${country.name}`} />

            <View style={styles.storiesSection}>
              <Text style={styles.sectionLabel}>
                {country.flag} trending in {country.name}
              </Text>
              {trends.map((t, i) => (
                <TrendCard key={i} trend={t} rank={i + 1} />
              ))}
            </View>

            <Text style={styles.footer}>
              tap any story to see the AI take + join the conversation ✦
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.surface },
  scroll:  { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 40 },

  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    padding: 16,
    paddingTop: 20,
  },
  wordmarkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  wordmark: { fontSize: 13, fontWeight: font.bold, letterSpacing: 2, color: colors.text, textTransform: 'uppercase' },
  betaBadge: { backgroundColor: colors.dark, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  betaText: { fontSize: 9, fontWeight: font.bold, letterSpacing: 1, color: '#fff' },
  headline: { fontSize: 26, fontWeight: font.bold, color: colors.text, lineHeight: 32, marginBottom: 4 },
  sub: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },

  fetchBtn: {
    marginHorizontal: 12,
    marginTop: 20,
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fetchBtnText: { color: '#fff', fontSize: 15, fontWeight: font.bold },

  center: { alignItems: 'center', marginTop: 60, gap: 12 },
  loadingText: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' },

  errorBox: {
    margin: 12, padding: 16,
    backgroundColor: colors.redBg,
    borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.redBorder,
  },
  errorTitle: { color: colors.redText, fontWeight: font.bold, fontSize: 14, marginBottom: 5 },
  errorMsg:   { color: colors.redText, fontSize: 13 },
  errorHint:  { color: colors.textSecondary, fontSize: 12, marginTop: 8, fontStyle: 'italic' },

  storiesSection: { padding: 12 },
  sectionLabel: {
    fontSize: 13, fontWeight: font.bold, color: colors.text,
    marginBottom: 10, textTransform: 'lowercase',
  },
  footer: {
    textAlign: 'center', color: colors.textTertiary,
    fontSize: 12, marginTop: 16, paddingHorizontal: 20,
  },
});
