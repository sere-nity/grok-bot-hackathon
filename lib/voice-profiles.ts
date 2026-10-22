export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  tone: string;
  vocabulary: string[];
  analogies: string[];
  channels: string[];
  examplePosts: string[];
}

export const voiceProfiles: VoiceProfile[] = [
  {
    id: "hacker-founder",
    name: "Hacker/Founder Community",
    description: "Technical builders shipping products",
    tone: "Direct, action-oriented, no BS. Values speed, learning by building, and product-market fit.",
    vocabulary: ["ship", "iterate", "MVP", "traction", "pivot", "PMF", "deploy", "scale", "users", "launch"],
    analogies: ["Like the early days of...", "Think YC Demo Day meets...", "This is the 'build weekend' for..."],
    channels: ["WhatsApp", "LinkedIn", "Discord"],
    examplePosts: [
      "🚀 Ship Mode: Building [X] this weekend. Demo at 7pm. Bring your feedback, leave with ideas.",
      "Real talk: How do you validate ideas without building full products? Join us Thursday to compare notes with builders who've been there.",
      "Last month's hack became a startup. This month: your turn? Hands-on session + zero fluff."
    ]
  },
  {
    id: "ai-builders",
    name: "Non-Engineers Building with AI",
    description: "Creators, operators, and domain experts using AI tools",
    tone: "Encouraging, jargon-free, focused on practical outcomes. Celebrates learning and experimentation.",
    vocabulary: ["automate", "workflow", "no-code", "prompt", "prototype", "save time", "experiment", "create", "build", "solve"],
    analogies: ["Like having a assistant who...", "Think of it as...", "Same way you'd use a spreadsheet but..."],
    channels: ["WhatsApp", "LinkedIn", "Discord"],
    examplePosts: [
      "✨ Build your first AI workflow (no coding required). Join us Tuesday to turn repetitive tasks into one-click automation.",
      "What if your daily grind ran itself? We're prototyping AI solutions for real work problems this Thursday. Bring your biggest time-sink.",
      "From idea to working prototype in 2 hours. That's what happened last session. Join the next one and see what you can build."
    ]
  },
  {
    id: "university-entrepreneurship",
    name: "University Entrepreneurship Society",
    description: "Students exploring startups and innovation",
    tone: "Energetic, inclusive, low-barrier. Emphasizes learning, networking, and career opportunities.",
    vocabulary: ["network", "career", "learn", "opportunity", "explore", "connect", "workshop", "skills", "future", "community"],
    analogies: ["Like the student version of...", "Think LinkedIn meets...", "Your introduction to..."],
    channels: ["WhatsApp", "LinkedIn", "Discord"],
    examplePosts: [
      "🎓 Ever wondered how to start a company at uni? Join us Thursday for pizza, founder stories, and actionable advice.",
      "Meet students who launched startups, hear what worked (and what didn't), and leave with a network. This Thursday, 6pm.",
      "Startup curious? Founder ready? Just exploring? All welcome. Workshop + networking this Thursday. Free food included."
    ]
  }
];
