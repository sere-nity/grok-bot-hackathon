import { NextRequest, NextResponse } from "next/server";
import { getLLMProvider } from "@/lib/llm-provider";
import { voiceProfiles } from "@/lib/voice-profiles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventData, voiceProfileId, notes } = body;
    
    const llm = getLLMProvider();
    const voiceProfile = voiceProfiles.find(p => p.id === voiceProfileId);
    
    if (!voiceProfile) {
      return NextResponse.json({ error: "Voice profile not found" }, { status: 400 });
    }
    
    // Generate run sheet
    const runSheetPrompt = `Create a detailed run sheet for this event:
Event: ${eventData.name}
Description: ${eventData.description || ""}
Start time: ${eventData.start_at ? new Date(eventData.start_at).toLocaleString() : "TBD"}
Notes: ${notes || ""}

Return JSON with: { timeline: [{ time: string, activity: string, owner: string, duration: number }] }`;
    
    const runSheet = await llm.generateJSON({ 
      prompt: runSheetPrompt,
      schema: { type: "object" }
    });
    
    // Generate budget
    const budgetPrompt = `Create a simple budget for this event:
Event: ${eventData.name}
Notes: ${notes || ""}

Return JSON with: { items: [{ category: string, description: string, cost: number }], total: number }`;
    
    const budget = await llm.generateJSON({
      prompt: budgetPrompt,
      schema: { type: "object" }
    });
    
    // Generate volunteer rota
    const volunteerPrompt = `Create a volunteer rota for this event:
Event: ${eventData.name}
Notes: ${notes || ""}

Return JSON with: { roles: [{ role: string, volunteers: string[], time: string }] }`;
    
    const volunteerRota = await llm.generateJSON({
      prompt: volunteerPrompt,
      schema: { type: "object" }
    });
    
    // Generate content with voice profile
    const voiceContext = `
Voice Profile: ${voiceProfile.name}
Tone: ${voiceProfile.tone}
Key vocabulary: ${voiceProfile.vocabulary.join(", ")}
Example analogies: ${voiceProfile.analogies.join("; ")}
`;
    
    const eventPageCopy = await llm.generateText({
      prompt: `Write compelling event page copy for this event in the voice of ${voiceProfile.name}:
Event: ${eventData.name}
Description: ${eventData.description || ""}
${voiceContext}

Write 2-3 paragraphs that capture attention and drive signups.`
    });
    
    const newsletterDraft = await llm.generateText({
      prompt: `Write a newsletter section for this event in the voice of ${voiceProfile.name}:
Event: ${eventData.name}
Description: ${eventData.description || ""}
${voiceContext}

Write 1-2 paragraphs for a community newsletter.`
    });
    
    // Generate social posts
    const whatsappPost = await llm.generateText({
      prompt: `Write a WhatsApp group message for this event in the voice of ${voiceProfile.name}:
Event: ${eventData.name}
${voiceContext}

Keep it under 200 characters, casual, with 1-2 emojis.`
    });
    
    const linkedinPost = await llm.generateText({
      prompt: `Write a LinkedIn post for this event in the voice of ${voiceProfile.name}:
Event: ${eventData.name}
Description: ${eventData.description || ""}
${voiceContext}

Professional but engaging, 2-3 sentences.`
    });
    
    const discordPost = await llm.generateText({
      prompt: `Write a Discord announcement for this event in the voice of ${voiceProfile.name}:
Event: ${eventData.name}
${voiceContext}

Use @everyone, keep it punchy with 1-2 emojis.`
    });
    
    return NextResponse.json({
      runSheet,
      budget,
      volunteerRota,
      content: {
        eventPageCopy,
        newsletterDraft,
        posts: {
          whatsapp: whatsappPost,
          linkedin: linkedinPost,
          discord: discordPost
        }
      }
    });
    
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
