# TrendWatch — Anti-Censorship Trends App

A React Native Web app that shows what's trending globally and highlights censorship gaps between countries, powered by Perplexity AI's `sonar` model.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your Perplexity API key
cp .env.example .env
# Edit .env and add your key

# 3. Run
npx expo start --web   # web browser
npx expo start         # mobile via Expo Go app
```

## Project Structure

```
TrendWatch/
├── App.js                  # Root entry point
├── .env.example            # Environment variable template
├── src/
│   ├── api/
│   │   └── perplexity.js   # Perplexity API calls (cached)
│   ├── screens/
│   │   └── HomeScreen.js   # Main trends screen
│   ├── components/
│   │   ├── CountryPicker.js
│   │   ├── TrendCard.js
│   │   └── CensorshipBadge.js
│   └── utils/
│       └── cache.js        # In-memory cache to save API credits
├── package.json
└── app.json
```

## Cost Efficiency

- Uses `sonar` model (cheapest Perplexity tier, ~$1/1M tokens)
- Results cached for **15 minutes** — one API call serves many views
- Each trend fetch costs roughly **$0.001–0.003**

## Getting a Perplexity API Key

1. Go to https://www.perplexity.ai
2. Sign in → Settings → API
3. Create a new key
4. Paste it into your `.env` file as `EXPO_PUBLIC_PERPLEXITY_API_KEY=your_key_here`
