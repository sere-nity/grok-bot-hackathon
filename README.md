# The Gate

**Every applicant gets a fair one-to-one with your community's values. A human makes the call.**

The Gate is an AI-powered community gatekeeper that vets applicants through simulated one-to-one conversations. Built for the Grok Bot Community Engineering London Hackathon.

## The Problem

Community organizers face a dilemma:
- **Open doors** → spam, scammers, and bad actors slip through
- **Strict vetting** → legitimate newcomers get blocked, especially beginners
- **Manual screening** → doesn't scale, inconsistent, time-consuming

Traditional keyword filters miss context. A "recruiter" might be someone genuinely offering value, or a spammer. You can't tell from a form.

## The Solution

**The Gate** creates digital clones of applicants from minimal seed data (GitHub + one-line intro) and interviews them using gatekeeper personas that embody your community's values. Each gatekeeper asks probing follow-up questions to separate genuine fit from keyword matching.

### Why simulate a conversation instead of scoring answers?

**Follow-ups separate real fit from gaming the system.**

- A keyword filter sees "I build things" and "token presale 100x" as equal strings
- A conversation reveals intent: "What kind of things?" → genuine builder vs. promoter
- The transcript becomes the explanation: you see *why* someone was accepted or declined
- Borderline cases get flagged for human judgment ("ask more")

### Key Features

1. **Digital Clones** - Built only from real seed data (GitHub profile + intro). Told to say "I don't know" rather than invent.

2. **Gatekeeper Personas** - Written from your community rules:
   - The Builder (checks: "You build things")
   - The Host (checks: "You'll give as much as you take" + "Be kind")
   - The Sentinel (checks: "No selling without permission")

3. **Parallel Interviews** - All applicants interviewed simultaneously, visible as animated dots on the field

4. **Shared Blocklist** - Known bad actors (stored as SHA-256 hashes) auto-declined with evidence

5. **Human Confirms Everything** - Suggested verdicts require human approval. Nothing is final until someone presses Accept/Ask/Decline.

6. **Transparent Reasons** - Every verdict shows:
   - Which community rule applies
   - Why that rule matters here
   - Direct quote from the transcript

## How It Works

```
Applicant arrives
  → Digital clone created from GitHub + intro
  → 3 gatekeepers interview in parallel (3-4 turns each)
  → Judge reviews transcript
  → Verdict: Accept / Ask more / Decline
  → Human confirms or overrides
  → Members or Turned away
```

## Demo

### Sample Applicants (Fictional Test Data)

The app includes 5 fictional test cases with expected verdicts:

1. **Priya** (@priya-builds)
   - ML engineer, 41 repos, offers to run a session
   - Expected: **Accept** (builds things, gives back)

2. **Tom** (@tom-first-hack)
   - First-year student, 2 repos, first hackathon
   - Expected: **Ask** (beginner, but beginners are welcome)

3. **CryptoKing** (@CryptoKing_88)
   - "Token presale 100x DM me", 0 repos, 2-day-old account
   - Expected: **Decline** (blocklist match + promotional spam)

4. **Dan** (@dan-talent)
   - Technical recruiter offering pizza/CV night, 0 repos
   - Expected: **Ask** (recruiting needs permission, verify intent)

5. **Aisha** (@aisha-designs)
   - Designer who codes, 18 repos, offers design feedback
   - Expected: **Accept** (builds things, gives back)

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Custom CSS with design tokens (Space Grotesk + JetBrains Mono fonts)
- **LLM**: xAI Grok API (OpenAI-compatible) for interviews
- **GitHub API**: Live profile data (optional GITHUB_TOKEN for higher rate limits)
- **Memory**: Cognee (optional, for grounding prompts with community context)
- **Streaming**: Server-Sent Events (SSE) for live transcript updates

## Quick Start

```bash
# Install dependencies
npm install

# Run in mock mode (no API keys needed)
npm run dev

# Open http://localhost:3000
```

The app works immediately with **high-quality mock interviews** for the 5 sample applicants.

### With API Keys (Optional)

```bash
# Copy environment template
cp .env.example .env

# Add your keys
XAI_API_KEY=your_xai_key          # For real LLM interviews
GITHUB_TOKEN=your_github_token     # For live GitHub data (optional)
COGNEE_ENABLED=false               # Memory layer (optional)
```

## Safety & Ethics

**This tool is designed with strong safety guardrails:**

1. **No clones without consent** - Only works with opt-in GitHub handles
2. **Human always decides** - AI suggests, human confirms every verdict
3. **Borderline → Ask** - When uncertain, flag for human judgment
4. **Never auto-decline real people** - Every decline requires human approval
5. **Blocklist hashed** - Handles stored as SHA-256, not plaintext
6. **Transparent reasons** - Every verdict quotes the transcript

**Important**: This tool is for initial vetting only. It complements, doesn't replace, human judgment.

## For Your Community

### Customize Rules

Edit `lib/config.ts`:

```typescript
export const COMMUNITY_RULES: CommunityRules = {
  build: 'You build things. Code, design, hardware, research all count.',
  give: "You'll give as much as you take.",
  nosell: 'No selling, recruiting or promoting without asking first.',
  kind: 'Be kind and curious. Beginners are welcome.',
  // Add your own rules here
};
```

### Customize Gatekeepers

```typescript
export const GATEKEEPERS: Gatekeeper[] = [
  { name: 'The Builder', rules: ['build'] },
  { name: 'The Host', rules: ['give', 'kind'] },
  { name: 'The Sentinel', rules: ['nosell'] },
  // Add or modify gatekeepers
];
```

### Add to Blocklist

```typescript
export const BLOCKLIST = [
  {
    handle: 'spammer_handle',  // lowercase, no @
    reported_by: 'Your Community',
    confirmed: true,
    evidence: 'Specific bad behavior with dates',
    sha256_prefix: 'abc123...',  // First 8 chars of SHA-256
  }
];
```

Generate SHA-256: `echo -n "handle" | sha256sum`

## Architecture

```
┌─────────────────┐
│  Next.js App    │
│  (TypeScript)   │
└────────┬────────┘
         │
         ├─→ /api/interview (SSE streaming)
         │   - Creates clone from seed data
         │   - Runs 3 gatekeeper interviews
         │   - Returns transcript + verdict
         │
         ├─→ /api/github
         │   - Fetches live GitHub data
         │   - Caches for 1 hour
         │
         └─→ Field UI
             - Animated dots between zones
             - Real-time transcript streaming
             - Person panel with verdict
```

### Mock Mode

When no API keys are set, the app uses **scripted high-quality interviews**:
- Realistic conversation flow (3-4 turns per gatekeeper)
- Accurate verdicts based on test cases
- Proper reasoning with quoted evidence
- Perfect for demos and testing

## Build & Deploy

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

## What's Left (Post-Hackathon)

- [ ] **Cognee integration** - Memory layer for community context (15-min time limit reached, shipped without it)
- [ ] Real LLM interview flow (mock mode fully functional)
- [ ] Batch processing for large applicant lists
- [ ] Export transcripts and verdicts
- [ ] Analytics dashboard (accept/decline rates over time)
- [ ] Multi-community shared blocklist network

## License

MIT License - see [LICENSE](LICENSE) file

## Contributing

This is an open-source hackathon project. Contributions welcome!

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Built For

Grok Bot Community Engineering London Hackathon
**Track 1: Gatekeeper**
Date: October 22, 2026

---

Made with ⚡ in 75 minutes
