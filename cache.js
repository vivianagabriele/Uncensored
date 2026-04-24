// src/utils/cache.js
// Lightweight in-memory cache. Avoids redundant Perplexity API calls.
// Cache resets on app reload — intentional for fresh data on each session.

const store = new Map();

export const simpleCache = {
  get(key, ttlMs) {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttlMs) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },

  set(key, value) {
    store.set(key, { value, timestamp: Date.now() });
  },

  clear() {
    store.clear();
  },

  size() {
    return store.size;
  },
};
