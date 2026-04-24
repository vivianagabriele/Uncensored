// src/screens/HomeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import CountryPicker, { COUNTRIES } from '../components/CountryPicker';
import TrendCard from '../components/TrendCard';
import { fetchTrends } from '../api/perplexity';
import { simpleCache } from '../utils/cache';

const DEFAULT_COUNTRY = COUNTRIES[0]; // USA

export default function HomeScreen() {
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const loadTrends = useCallback(async (selectedCountry, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    if (forceRefresh) simpleCache.clear();
    try {
      const data = await fetchTrends(selectedCountry.name, selectedCountry.code);
      setTrends(data);
      setLastFetched(new Date());
    } catch (e) {
      setError(e.message);
      setTrends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleCountrySelect(c) {
    setCountry(c);
    setTrends([]);
    setLastFetched(null);
    loadTrends(c);
  }

  const highCensorship = trends.filter(t => (t.sensitivityScore ?? 0) >= 7).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => loadTrends(country, true)}
            tintColor="#e85d26"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>TRENDWATCH</Text>
          <Text style={styles.tagline}>Uncensored global trends</Text>
        </View>

        {/* Country picker */}
        <CountryPicker selected={country} onSelect={handleCountrySelect} />

        {/* Fetch button (initial load) */}
        {trends.length === 0 && !loading && !error && (
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={() => loadTrends(country)}
            activeOpacity={0.8}
          >
            <Text style={styles.fetchButtonText}>
              Load trends for {country.flag} {country.name}
            </Text>
          </TouchableOpacity>
        )}

        {/* Loading */}
        {loading && trends.length === 0 && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#e85d26" />
            <Text style={styles.loadingText}>Searching the open web…</Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>⚠️ Error</Text>
            <Text style={styles.errorMsg}>{error}</Text>
            {error.includes('API key') && (
              <Text style={styles.errorHint}>
                → Copy .env.example to .env and add your Perplexity key
              </Text>
            )}
          </View>
        )}

        {/* Results header */}
        {trends.length > 0 && (
          <>
            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsTitle}>
                  {country.flag} Trending in {country.name}
                </Text>
                {lastFetched && (
                  <Text style={styles.resultsTime}>
                    Updated {lastFetched.toLocaleTimeString()} · pull to refresh
                  </Text>
                )}
              </View>
              {highCensorship > 0 && (
                <View style={styles.alertBadge}>
                  <Text style={styles.alertText}>
                    🚫 {highCensorship} high-risk
                  </Text>
                </View>
              )}
            </View>

            {trends.map((trend, i) => (
              <TrendCard key={i} trend={trend} rank={i + 1} />
            ))}

            <Text style={styles.footer}>
              Tap any card for a full censorship analysis · Powered by Perplexity sonar
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#f0f0f8',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#e85d26',
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  fetchButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#e85d26',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  fetchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
    marginTop: 60,
    gap: 16,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorBox: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1a0808',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5a1a1a',
  },
  errorTitle: {
    color: '#cc4444',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  errorMsg: {
    color: '#aa6666',
    fontSize: 13,
  },
  errorHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  resultsTitle: {
    color: '#f0f0f8',
    fontSize: 17,
    fontWeight: '700',
  },
  resultsTime: {
    color: '#555',
    fontSize: 11,
    marginTop: 2,
  },
  alertBadge: {
    backgroundColor: '#2a0808',
    borderWidth: 1,
    borderColor: '#5a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertText: {
    color: '#cc4444',
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#333',
    fontSize: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
});
