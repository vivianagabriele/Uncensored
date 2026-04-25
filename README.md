# TrendWatch 👀
### Real stories. No filters. No BS.

A playful, AI-first React Native Web app that shows what's trending globally — and what's being suppressed. Powered by Perplexity AI's `sonar` model.

## Quick Start

```bash
npm install
cp .env.example .env
# Add your Perplexity key to .env
npx expo start --web
```

## Get a Perplexity API Key
1. Go to https://www.perplexity.ai → sign in → Settings → API
2. Generate a key
3. Paste into `.env` as `EXPO_PUBLIC_PERPLEXITY_API_KEY=your_key`

## Project Structure

```
src/
├── api/
│   └── perplexity.js      # All AI calls (trends, briefing, detail, ask)
├── components/
│   ├── AskBar.js          # Freeform AI question bar + quick chips
│   ├── BriefingCard.js    # Dark AI briefing panel
│   ├── CountryPicker.js   # Horizontal country selector
│   └── TrendCard.js       # Story card with AI take + comments
├── screens/
│   └── HomeScreen.js      # Main feed
├── utils/
│   ├── cache.js           # 15-min in-memory cache
│   └── identity.js        # Anonymous name/avatar generator
└── theme.js               # Colors, radius, font tokens
```

## Features
- 🌍 12 countries tracked
- ✦ Ask bar — freeform questions answered by Perplexity AI
- 🤖 AI briefing card — live summary of what's being suppressed
- 📊 Suppression bar on every story
- 💬 Anonymous comments (no account needed)
- ↑ Upvote + confirm reactions
- 🔥 "Spiking" live indicators on fast-moving stories
- 💾 15-min cache — efficient and cheap (~$0.001–0.003 per fetch)
