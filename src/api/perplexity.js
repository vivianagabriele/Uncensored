// src/api/perplexity.js
// All Perplexity API calls. Uses the cheap "sonar" model with 15-min caching.

import { simpleCache } from '../utils/cache';

const API_URL = 'https://api.perplexity.ai/chat/completions';
const MODEL   = 'sonar';
const TTL     = 15 * 60 * 1000; // 15 minutes

function getKey() {
  const k = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY;
  if (!k || k === 'your_perplexity_api_key_here') {
    throw new Error('Add your Perplexity API key to .env as EXPO_PUBLIC_PERPLEXITY_API_KEY');
  }
  return k;
}

async function call(prompt, maxTokens = 900) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content:
            'You are a sharp, witty journalist who writes for a Gen Z audience. ' +
            'You cover global censorship and free speech with urgency and clarity — ' +
            'never dry, always punchy. Respond ONLY with valid JSON, no markdown fences.',
        },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Perplexity ${res.status}: ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? '';
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, parseError: true };
  }
}

export async function fetchTrends(countryName, countryCode) {
  const key    = `trends_${countryCode}`;
  const cached = simpleCache.get(key, TTL);
  if (cached) return cached;

  const prompt = `What are the top 7 trending news stories in ${countryName} RIGHT NOW?

Return a JSON array. Each item must have:
- "title": punchy headline, written casually like you'd say it to a friend (max 10 words)
- "summary": one sentence in casual, direct language — add a relevant emoji at the end
- "category": one of [Politics, Tech, Economy, Society, Sports, Entertainment, Health]
- "suppressionScore": integer 1-100 (100 = completely suppressed globally)
- "isLive": boolean — true if actively developing right now
- "liveLabel": if isLive, short label like "Spiking 🔥" or "Breaking" or "Active" (else null)
- "blockedIn": array of country names suppressing this story (empty if none)
- "openIn": array of up to 4 country names freely reporting this

Return ONLY the JSON array.`;

  const result = await call(prompt);
  const trends = Array.isArray(result) ? result : [];
  simpleCache.set(key, trends);
  return trends;
}

export async function fetchBriefing(countryName, countryCode) {
  const key    = `briefing_${countryCode}`;
  const cached = simpleCache.get(key, TTL);
  if (cached) return cached;

  const prompt = `Write a punchy AI briefing about censorship and news suppression in ${countryName} today.

Return a JSON object with:
- "text": 2 sentences max. Casual, urgent. Bold the most important phrase using **markdown bold**. Include an emoji.
- "storiesTracked": integer
- "suppressed": integer
- "comments": integer (realistic engagement number)

Return ONLY the JSON object.`;

  const result = await call(prompt, 300);
  simpleCache.set(key, result);
  return result;
}

export async function fetchStoryDetail(title) {
  const key    = `detail_${title.slice(0, 40)}`;
  const cached = simpleCache.get(key, TTL);
  if (cached) return cached;

  const prompt = `Give me the real story on: "${title}"

Write like a sharp journalist for a Gen Z audience.

Return a JSON object with:
- "aiTake": 3-4 punchy sentences. Highlight the most surprising fact using **markdown bold**.
- "blockedIn": array of country names suppressing this
- "openIn": array of country names freely reporting this
- "whySuppressed": one casual sentence on why governments hate this story (or null)
- "sources": array of up to 3 news outlet names

Return ONLY the JSON object.`;

  const result = await call(prompt, 500);
  simpleCache.set(key, result);
  return result;
}

export async function askQuestion(question) {
  const prompt = `A user asked: "${question}"

Answer as a witty journalist covering global censorship for a Gen Z audience.
Under 4 sentences, concrete facts, 1-2 emojis. **Bold** key facts.
Return a JSON object with:
- "answer": your response
- "relatedCountries": array of up to 3 relevant country names

Return ONLY the JSON object.`;

  return call(prompt, 400);
}
