import { NextRequest } from 'next/server';
import { SAMPLE_APPLICANTS, COMMUNITY_RULES, GATEKEEPERS, BLOCKLIST } from '@/lib/config';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Mock interview generator
function generateMockInterview(applicant: any) {
  const transcript = [];
  const name = applicant.name;
  const handle = applicant.handle.toLowerCase();
  
  // Check blocklist
  const handleHash = crypto.createHash('sha256').update(handle.replace('@', '')).digest('hex');
  const blocklistMatch = BLOCKLIST.find(b => handleHash.startsWith(b.sha256_prefix));
  
  if (blocklistMatch) {
    return {
      transcript: [
        {
          speaker: 'The Sentinel',
          role: 'gatekeeper',
          text: `I see you're interested in joining. Can you tell me what brings you here?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: applicant.intro,
          timestamp: new Date().toISOString(),
        }
      ],
      verdict: {
        decision: 'decline',
        reasons: [
          {
            rule: 'nosell',
            ruleText: COMMUNITY_RULES.nosell,
            explanation: 'This account appears on our shared blocklist for promotional spam.',
            quote: blocklistMatch.evidence,
          }
        ],
        suggested: true,
      },
      blocklistMatch: {
        ...blocklistMatch,
        sha256_prefix: handleHash.substring(0, 8),
      }
    };
  }

  // Generate appropriate interview based on applicant
  if (name === 'Priya') {
    return {
      transcript: [
        {
          speaker: 'The Builder',
          role: 'gatekeeper',
          text: `Hi Priya! I see you're working on agent memory. What kind of things are you building?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `I maintain an open-source library for agent memory layers. It's been really interesting working on efficient context retrieval and long-term memory persistence.`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'The Host',
          role: 'gatekeeper',
          text: `That's fascinating! You mentioned offering a session - what would that look like?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `I'd love to share what I've learned about implementing memory systems. Happy to do a technical deep-dive or help others working on similar problems.`,
          timestamp: new Date().toISOString(),
        },
      ],
      verdict: {
        decision: 'accept',
        reasons: [
          {
            rule: 'build',
            ruleText: COMMUNITY_RULES.build,
            explanation: 'Actively maintains open-source projects and works on technical challenges.',
            quote: 'I maintain an open-source library for agent memory layers',
          },
          {
            rule: 'give',
            ruleText: COMMUNITY_RULES.give,
            explanation: 'Offers to share knowledge and help others in the community.',
            quote: 'Happy to do a technical deep-dive or help others working on similar problems',
          }
        ],
        suggested: true,
      }
    };
  }

  if (name === 'Tom') {
    return {
      transcript: [
        {
          speaker: 'The Builder',
          role: 'gatekeeper',
          text: `Welcome! Tell me about your experience with building things.`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `I'm a first-year student and this is my first hackathon. I've been learning to code for a few months.`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'The Host',
          role: 'gatekeeper',
          text: `That's great that you're getting started! What are you hoping to learn or work on?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `I'm not sure yet, but I'm excited to learn from others and see what people are building. Maybe contribute where I can.`,
          timestamp: new Date().toISOString(),
        },
      ],
      verdict: {
        decision: 'ask',
        reasons: [
          {
            rule: 'kind',
            ruleText: COMMUNITY_RULES.kind,
            explanation: 'Beginners are explicitly welcome. This person is new but enthusiastic.',
            quote: "I'm excited to learn from others and see what people are building",
          },
          {
            rule: 'build',
            ruleText: COMMUNITY_RULES.build,
            explanation: 'Very early in their journey. Worth asking more about their interests and commitment.',
            quote: "I've been learning to code for a few months",
          }
        ],
        suggested: true,
      }
    };
  }

  if (name === 'Dan') {
    return {
      transcript: [
        {
          speaker: 'The Sentinel',
          role: 'gatekeeper',
          text: `Hi Dan. What brings you to our community?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `I'm a technical recruiter and I'd love to host a pizza night where people can get CV feedback and hear about opportunities.`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'The Host',
          role: 'gatekeeper',
          text: `That's an interesting offer. Are you also building things yourself, or primarily recruiting?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `Primarily recruiting, but I work with a lot of engineers and understand the space well.`,
          timestamp: new Date().toISOString(),
        },
      ],
      verdict: {
        decision: 'ask',
        reasons: [
          {
            rule: 'nosell',
            ruleText: COMMUNITY_RULES.nosell,
            explanation: 'This is recruiting, which needs explicit permission. The offer of pizza is nice but the primary intent is business.',
            quote: "I'm a technical recruiter",
          },
          {
            rule: 'give',
            ruleText: COMMUNITY_RULES.give,
            explanation: 'The CV feedback offer shows willingness to give, but we should verify this is genuine mutual value and not just lead generation.',
            quote: 'host a pizza night where people can get CV feedback',
          }
        ],
        suggested: true,
      }
    };
  }

  if (name === 'Aisha') {
    return {
      transcript: [
        {
          speaker: 'The Builder',
          role: 'gatekeeper',
          text: `Hi Aisha! I see you're a designer who codes. Tell me more about that.`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `I do product design but I also prototype in code. I find it helps me think through interactions better, and I can ship small features myself.`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: 'The Host',
          role: 'gatekeeper',
          text: `That's a great skill combination. You mentioned offering design feedback?`,
          timestamp: new Date().toISOString(),
        },
        {
          speaker: `${name}'s clone`,
          role: 'clone',
          text: `Yes! I love helping people think through UX problems. I've learned a lot from other builders and want to give back.`,
          timestamp: new Date().toISOString(),
        },
      ],
      verdict: {
        decision: 'accept',
        reasons: [
          {
            rule: 'build',
            ruleText: COMMUNITY_RULES.build,
            explanation: 'Actively builds things - both designs and code prototypes.',
            quote: 'I do product design but I also prototype in code',
          },
          {
            rule: 'give',
            ruleText: COMMUNITY_RULES.give,
            explanation: 'Explicitly wants to help others and give back to the community.',
            quote: "I love helping people think through UX problems. I've learned a lot from other builders and want to give back",
          }
        ],
        suggested: true,
      }
    };
  }

  // Default case
  return {
    transcript: [
      {
        speaker: 'The Builder',
        role: 'gatekeeper',
        text: `Hi! Tell me about what you build.`,
        timestamp: new Date().toISOString(),
      },
      {
        speaker: `${name}'s clone`,
        role: 'clone',
        text: applicant.intro || "I'm interested in joining the community.",
        timestamp: new Date().toISOString(),
      }
    ],
    verdict: {
      decision: 'ask',
      reasons: [
        {
          rule: 'build',
          ruleText: COMMUNITY_RULES.build,
          explanation: 'Need more information about their building activity.',
          quote: applicant.intro || '',
        }
      ],
      suggested: true,
    }
  };
}

export async function POST(request: NextRequest) {
  const { applicantId } = await request.json();
  
  // Find applicant (check samples first)
  let applicant = SAMPLE_APPLICANTS.find(a => a.id === applicantId);
  
  if (!applicant) {
    return new Response('Applicant not found', { status: 404 });
  }

  // Create streaming response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial status update
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ status: 'interviewing' })}\n\n`));
      
      // Simulate delay for realism
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock interview
      const result = generateMockInterview(applicant);
      
      // Stream transcript entries
      for (const entry of result.transcript) {
        await new Promise(resolve => setTimeout(resolve, 800));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          transcript: result.transcript.slice(0, result.transcript.indexOf(entry) + 1)
        })}\n\n`));
      }
      
      // Send blocklist match if exists
      if (result.blocklistMatch) {
        await new Promise(resolve => setTimeout(resolve, 500));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          blocklistMatch: result.blocklistMatch
        })}\n\n`));
      }
      
      // Send verdict
      await new Promise(resolve => setTimeout(resolve, 1000));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({
        status: 'needs_human',
        verdict: result.verdict
      })}\n\n`));
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
