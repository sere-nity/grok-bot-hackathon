import OpenAI from 'openai';
import { COMMUNITY_RULES, GATEKEEPERS } from './config';
import { TranscriptEntry, Verdict } from './types';

const hasApiKey = !!process.env.XAI_API_KEY;

let client: OpenAI | null = null;
if (hasApiKey) {
  client = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  });
}

export function isLiveMode(): boolean {
  return hasApiKey;
}

export async function conductInterview(
  applicant: { name: string; handle: string; intro: string; githubData?: any },
  onTranscriptUpdate: (entry: TranscriptEntry) => void
): Promise<Verdict> {
  if (!client) {
    throw new Error('No API key available');
  }

  const transcript: TranscriptEntry[] = [];

  // Build clone persona from seed data only
  const cloneContext = buildCloneContext(applicant);

  // Each gatekeeper asks questions
  for (const gatekeeper of GATEKEEPERS) {
    const questions = await generateGatekeeperQuestions(
      gatekeeper,
      applicant,
      transcript,
      cloneContext
    );

    for (const question of questions) {
      // Gatekeeper asks
      const gatekeeperEntry: TranscriptEntry = {
        speaker: gatekeeper.name,
        role: 'gatekeeper',
        text: question,
        timestamp: new Date().toISOString(),
      };
      transcript.push(gatekeeperEntry);
      onTranscriptUpdate(gatekeeperEntry);

      // Clone responds
      const response = await getCloneResponse(
        question,
        cloneContext,
        transcript,
        applicant.name
      );

      const cloneEntry: TranscriptEntry = {
        speaker: `${applicant.name}'s clone`,
        role: 'clone',
        text: response,
        timestamp: new Date().toISOString(),
      };
      transcript.push(cloneEntry);
      onTranscriptUpdate(cloneEntry);

      // Small delay between turns
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  // Judge makes decision
  const verdict = await judgeInterview(transcript, applicant);
  return verdict;
}

function buildCloneContext(applicant: any): string {
  let context = `You are a digital clone created ONLY from this seed data. Never invent information.

SEED DATA:
- Intro: "${applicant.intro}"`;

  if (applicant.githubData) {
    context += `
- GitHub account age: ${applicant.githubData.days} days (since ${new Date(applicant.githubData.since).toLocaleDateString()})
- Public repositories: ${applicant.githubData.repos}
- Followers: ${applicant.githubData.followers}
- Languages: ${applicant.githubData.languages.join(', ') || 'none'}`;

    if (applicant.githubData.recentRepos?.length > 0) {
      context += `\n- Recent repositories: ${applicant.githubData.recentRepos.map((r: any) => r.name).join(', ')}`;
    }
  }

  context += `\n\nIMPORTANT: Only discuss what's in this seed data. If asked about something not mentioned here, say "I don't know" or "That's not in my GitHub profile." Do not invent projects, skills, or experiences.`;

  return context;
}

async function generateGatekeeperQuestions(
  gatekeeper: any,
  applicant: any,
  transcript: TranscriptEntry[],
  cloneContext: string
): Promise<string[]> {
  if (!client) throw new Error('No client');

  const rules = gatekeeper.rules.map((r: string) => `${r}: ${COMMUNITY_RULES[r]}`).join('\n');
  
  const previousConversation = transcript
    .map(t => `${t.speaker}: ${t.text}`)
    .join('\n');

  const prompt = `You are ${gatekeeper.name}, a gatekeeper for a community. Your job is to ask 1-2 probing questions to verify if this applicant fits these rules:

${rules}

Applicant info:
- Name: ${applicant.name}
- Intro: "${applicant.intro}"
${applicant.githubData ? `- GitHub: ${applicant.githubData.repos} repos, ${applicant.githubData.days} days old` : ''}

${previousConversation ? `Previous conversation:\n${previousConversation}\n` : ''}

Ask 1-2 specific, probing questions that will help determine if they genuinely fit your rules. Be friendly but direct. Get specifics, not vague claims.

Return ONLY your questions, one per line, without any preamble.`;

  const response = await client.chat.completions.create({
    model: 'grok-beta',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 150,
  });

  const questions = response.choices[0].message.content
    ?.trim()
    .split('\n')
    .filter(q => q.trim().length > 0)
    .slice(0, 2) || ['Tell me more about what you do.'];

  return questions;
}

async function getCloneResponse(
  question: string,
  cloneContext: string,
  transcript: TranscriptEntry[],
  name: string
): Promise<string> {
  if (!client) throw new Error('No client');

  const conversationHistory = transcript
    .map(t => `${t.speaker}: ${t.text}`)
    .join('\n');

  const prompt = `${cloneContext}

Previous conversation:
${conversationHistory}

New question: ${question}

Respond naturally as ${name} would, based ONLY on the seed data above. If the question asks about something not in your seed data, say you don't know or it's not in your profile. Keep responses concise (2-3 sentences).`;

  const response = await client.chat.completions.create({
    model: 'grok-beta',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 120,
  });

  return response.choices[0].message.content?.trim() || "I'm not sure about that.";
}

async function judgeInterview(
  transcript: TranscriptEntry[],
  applicant: any
): Promise<Verdict> {
  if (!client) throw new Error('No client');

  const conversation = transcript
    .map(t => `${t.speaker}: ${t.text}`)
    .join('\n');

  const rulesText = Object.entries(COMMUNITY_RULES)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const prompt = `You are a judge reviewing a community application interview. Based on the conversation, decide: accept, ask, or decline.

COMMUNITY RULES:
${rulesText}

APPLICANT: ${applicant.name} (@${applicant.handle})
${applicant.githubData ? `GitHub: ${applicant.githubData.repos} repos, ${applicant.githubData.days} days old, languages: ${applicant.githubData.languages.join(', ')}` : ''}

INTERVIEW TRANSCRIPT:
${conversation}

DECISION CRITERIA:
- Accept: Clear evidence they fit the rules
- Ask: Borderline, need more info, or beginners who might be welcome
- Decline: Clear mismatch with rules, spam, or bad behavior

Return ONLY valid JSON (no markdown, no code blocks):
{
  "decision": "accept" | "ask" | "decline",
  "reasons": [
    {
      "rule": "rule_key",
      "text": "the rule text",
      "explanation": "why this applies",
      "quote": "exact quote from transcript"
    }
  ]
}`;

  const response = await client.chat.completions.create({
    model: 'grok-beta',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');

  // Ensure reasons have rule text filled in
  if (result.reasons) {
    result.reasons = result.reasons.map((r: any) => ({
      ...r,
      ruleText: r.text || COMMUNITY_RULES[r.rule] || '',
    }));
  }

  return {
    decision: result.decision || 'ask',
    reasons: result.reasons || [],
    suggested: true,
  };
}
