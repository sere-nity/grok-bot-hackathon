# Event Autopilot

**Turn one event into everything you need, in your community's voice.**

Event Autopilot generates run sheets, budgets, volunteer rotas, event copy, newsletters, social posts, and on-brand visuals from a single event idea or Luma URL. Built for the Grok Bot Community Engineering London Hackathon.

## 🎯 The Problem

Community leads spend hours on repetitive event planning: creating run sheets, writing posts for different platforms, designing graphics, and managing budgets. The same event needs different messaging for different communities (technical founders vs. non-engineers vs. students).

## ✨ The Solution

**Event Autopilot** does the repetitive work in seconds:
- **Input**: One-line event idea OR Luma event URL + notes
- **Output**: Complete event package with run sheet, budget, volunteer rota, event page copy, newsletter draft, platform-specific posts (WhatsApp, LinkedIn, Discord), and downloadable event graphic
- **Voice Profiles**: The same event, rewritten for your community's tone, vocabulary, and channels
- **One-Click Approval**: Review board with hours-saved counter, approve/edit/regenerate per asset

## 🚀 Demo Flow

1. **Input** → Enter event idea or paste Luma URL, add notes (venue, budget, volunteers)
2. **Select Voice** → Choose from 3 example profiles (hacker/founder, AI builders, university entrepreneurship)
3. **Generate** → Get all assets in 5-10 seconds with streaming progress
4. **Review** → Side-by-side comparison, channel-specific previews, approve/edit/regenerate
5. **Export** → Download graphic, see hours saved counter (285 minutes total if all approved)

## 📦 What's Included

- **Run Sheet**: Timed agenda with owners and durations
- **Budget**: Itemized costs with total
- **Volunteer Rota**: Roles, assignments, time slots
- **Event Page Copy**: 2-3 paragraphs in your community's voice
- **Newsletter Draft**: Ready-to-send community update
- **Social Posts**: Platform-optimized for WhatsApp, LinkedIn, Discord
- **Event Graphic**: HTML/SVG-based design exported to PNG (1200x630)
- **Hours Saved**: Live counter showing manual time vs. automated (285 min total)

## 🎨 Voice Profiles

Each profile represents a community's unique voice:

1. **Hacker/Founder Community**
   - Direct, action-oriented, no BS
   - Vocabulary: ship, iterate, MVP, traction, PMF
   - Example: "🚀 Ship Mode: Building [X] this weekend. Demo at 7pm."

2. **Non-Engineers Building with AI**
   - Encouraging, jargon-free, practical
   - Vocabulary: automate, workflow, no-code, experiment
   - Example: "✨ Build your first AI workflow (no coding required)."

3. **University Entrepreneurship Society**
   - Energetic, inclusive, low-barrier
   - Vocabulary: network, career, learn, opportunity
   - Example: "🎓 Ever wondered how to start a company at uni? Join us Thursday."

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Fonts**: Geist Sans & Mono
- **LLM**: xAI Grok API (OpenAI-compatible) with provider abstraction
- **Image Generation**: @vercel/og (Satori) for HTML/SVG → PNG
- **Storage**: Local JSON (no database required)
- **Mock Mode**: High-quality canned responses when no API key is set

## 🏃 Quick Start

```bash
# Install dependencies
npm install

# Run in mock mode (no API key needed)
npm run dev

# Open http://localhost:3000
```

The app works out of the box in **mock mode** with realistic generated content. Perfect for demos!

### With API Key (Optional)

```bash
# Copy environment template
cp .env.example .env

# Add your API key (choose one)
# Option 1: xAI Grok (recommended)
XAI_API_KEY=your_xai_api_key_here

# Option 2: OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Run dev server
npm run dev
```

Get a Grok API key: https://console.x.ai/

## 📖 How to Add Your Community's Voice Profile

Voice profiles are defined in `lib/voice-profiles.ts`. Add a new profile:

```typescript
{
  id: "your-community",
  name: "Your Community Name",
  description: "One-line description",
  tone: "Describe the tone: friendly, professional, technical, casual, etc.",
  vocabulary: ["key", "words", "your", "community", "uses"],
  analogies: ["Like X meets Y", "Think of it as..."],
  channels: ["WhatsApp", "LinkedIn", "Discord", "Twitter", "Slack"],
  examplePosts: [
    "Example 1: Short sample post in your voice",
    "Example 2: Another sample showing your style",
    "Example 3: One more for variety"
  ]
}
```

The more specific your tone/vocabulary/examples, the better the AI matches your voice.

## 🧪 Build & Deploy

```bash
# Verify build passes
npm run build

# Start production server
npm start
```

Deploy to Vercel:
```bash
vercel
```

Or any Node.js host (Render, Railway, Fly.io, etc.)

## 🎯 Judging Criteria Alignment

- **Weekly Work Automated**: 285 minutes (4.75 hours) per event
- **Copy & Visuals Quality**: Voice-matched copy + downloadable PNG graphic
- **Volunteer Hours Saved**: Live counter prominently shown
- **Community Lead Trust**: Professional UI, review/edit/regenerate controls
- **Community Context**: 3 voice profiles, learns from example posts
- **Open Source & Reusable**: MIT license, easy to add voice profiles
- **Demo Quality**: Polished dark UI, smooth animations, one-click sample event

## 📸 Screenshots

[Screenshots will be added after running the app]

## 🤝 Contributing

This is an open-source hackathon project. Contributions welcome!

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🏆 Built For

Grok Bot Community Engineering London Hackathon
Track: Event Autopilot
Date: October 22, 2026

---

Made with ⚡ by the Event Autopilot team
