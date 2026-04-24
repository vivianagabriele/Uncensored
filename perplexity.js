// src/api/perplexity.js
// Handles all Perplexity API calls with in-memory caching to minimize cost.
// Uses the "sonar" model — cheapest option, ~$1/1M tokens.

import { simpleCache } from '../utils/cache';

const API_URL = 'https://api.perplexity.ai/chat/completions';
const MODEL = 'sonar'; // cheapest, fast, web-search enabled
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getApiKey() {
  const key = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY;
  if (!key || key === 'your_perplexity_api_key_here') {
    throw new Error('Missing Perplexity API key. Copy .env.example to .env and add your key.');
  }
  return key;
}

async function callPerplexity(prompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content:
            'You are a journalist specializing in global trends and censorship. ' +
            'Always respond with valid JSON only — no markdown, no code fences. ' +
            'Be concise to minimize token usage.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Perplexity API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? '';

  try {
    return JSON.parse(text);
  } catch {
    // If JSON parsing fails, return raw text so the UI can still show something
    return { raw: text, parseError: true };
  }
}

/**
 * Fetch trending topics for a given country.
 * Returns an array of trend objects.
 */
export async function fetchTrends(countryName, countryCode) {
  const cacheKey = `trends_${countryCode}`;
  const cached = simpleCache.get(cacheKey, CACHE_TTL_MS);
  if (cached) return cached;

  const prompt = `List the top 7 trending news topics in ${countryName} RIGHT NOW.
For each topic return a JSON array where each item has:
- "title": short headline (max 8 words)
- "summary": one sentence explanation (max 20 words)
- "category": one of [Politics, Tech, Economy, Society, Sports, Entertainment, Health]
- "censoredIn": array of country names where this topic is being suppressed or censored (empty array if none)
- "sensitivityScore": integer 1-10 (10 = most likely to be censored globally)

Return ONLY the JSON array, nothing else.`;

  const result = await callPerplexity(prompt);
  const trends = Array.isArray(result) ? result : [];
  simpleCache.set(cacheKey, trends);
  return trends;
}

/**
 * Get a deeper analysis of a single trend topic across countries.
 */
export async function fetchTrendDetail(trendTitle) {
  const cacheKey = `detail_${trendTitle.slice(0, 40)}`;
  const cached = simpleCache.get(cacheKey, CACHE_TTL_MS);
  if (cached) return cached;

  const prompt = `Analyze this trending topic: "${trendTitle}"

Return a JSON object with:
- "fullSummary": 2-3 sentence overview
- "countriesReporting": array of up to 5 country names openly covering this
- "countriesSuppressing": array of up to 5 country names blocking or suppressing this
- "whyCensored": one sentence on WHY governments might suppress this (or null if not applicable)
- "sources": array of up to 3 source names (news outlets) covering this

Return ONLY the JSON object.`;

  const result = await callPerplexity(prompt);
  simpleCache.set(cacheKey, result);
  return result;
}
