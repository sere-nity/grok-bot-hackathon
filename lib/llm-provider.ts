import OpenAI from "openai";

export interface LLMProvider {
  generateJSON<T>(options: {
    prompt: string;
    schema: any;
    temperature?: number;
  }): Promise<T>;
  
  generateText(options: {
    prompt: string;
    temperature?: number;
  }): Promise<string>;
}

class RealLLMProvider implements LLMProvider {
  private client: OpenAI;
  
  constructor() {
    const apiKey = process.env.XAI_API_KEY || process.env.OPENAI_API_KEY;
    const baseURL = process.env.XAI_API_KEY 
      ? "https://api.x.ai/v1" 
      : "https://api.openai.com/v1";
    
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }
  
  async generateJSON<T>(options: {
    prompt: string;
    schema: any;
    temperature?: number;
  }): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: process.env.XAI_API_KEY ? "grok-beta" : "gpt-4o",
      messages: [{ role: "user", content: options.prompt }],
      temperature: options.temperature || 0.7,
      response_format: { type: "json_object" },
    });
    
    return JSON.parse(response.choices[0].message.content || "{}");
  }
  
  async generateText(options: {
    prompt: string;
    temperature?: number;
  }): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: process.env.XAI_API_KEY ? "grok-beta" : "gpt-4o",
      messages: [{ role: "user", content: options.prompt }],
      temperature: options.temperature || 0.7,
    });
    
    return response.choices[0].message.content || "";
  }
}

class MockLLMProvider implements LLMProvider {
  async generateJSON<T>(options: { prompt: string }): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return mock data based on prompt content
    if (options.prompt.includes("run sheet")) {
      return {
        timeline: [
          { time: "17:30", activity: "Doors open, registration", owner: "Sarah", duration: 30 },
          { time: "18:00", activity: "Welcome & intro to the session", owner: "Alex", duration: 10 },
          { time: "18:10", activity: "Main workshop: Build with AI", owner: "Jordan", duration: 60 },
          { time: "19:10", activity: "Break & networking", owner: "Team", duration: 20 },
          { time: "19:30", activity: "Demo showcase & Q&A", owner: "Alex", duration: 25 },
          { time: "19:55", activity: "Closing remarks & next steps", owner: "Sarah", duration: 5 },
          { time: "20:00", activity: "Wrap up", owner: "Team", duration: 0 }
        ]
      } as T;
    }
    
    if (options.prompt.includes("budget")) {
      return {
        items: [
          { category: "Venue", description: "Room rental", cost: 150 },
          { category: "Food & Drink", description: "Pizza & soft drinks for 40 people", cost: 320 },
          { category: "Materials", description: "Name tags, markers, printouts", cost: 30 },
          { category: "Tech", description: "HDMI adapter, extension cords", cost: 0 },
        ],
        total: 500
      } as T;
    }
    
    if (options.prompt.includes("volunteer")) {
      return {
        roles: [
          { role: "Registration", volunteers: ["Sarah", "Maya"], time: "17:15 - 18:15" },
          { role: "Tech Support", volunteers: ["Jordan"], time: "17:30 - 20:00" },
          { role: "Photography", volunteers: ["Chris"], time: "18:00 - 20:00" },
          { role: "Food Coordinator", volunteers: ["Alex", "Sam"], time: "17:45 - 19:15" },
          { role: "Cleanup", volunteers: ["Everyone"], time: "20:00 - 20:30" }
        ]
      } as T;
    }
    
    return {} as T;
  }
  
  async generateText(options: { prompt: string }): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (options.prompt.includes("event page")) {
      return "Join us for an incredible evening of building, learning, and connecting with fellow makers. Whether you're shipping your first product or your tenth, this is your space to learn practical strategies, get feedback, and meet people who get it.";
    }
    
    if (options.prompt.includes("newsletter")) {
      return "This month's session is one you won't want to miss. We're diving deep into practical strategies that actually work, with real examples from our community. Expect hands-on learning, quality conversations, and the kind of insights that make you rethink your approach.";
    }
    
    if (options.prompt.includes("WhatsApp")) {
      return "🚀 Thursday 6pm: Build + ship together. Real projects, real feedback, real people. See you there!";
    }
    
    if (options.prompt.includes("LinkedIn")) {
      return "Excited to share our next community session this Thursday at 6pm. We'll explore practical approaches to building with AI, share real case studies, and create space for meaningful connections. Open to all who are building or curious about the space.";
    }
    
    if (options.prompt.includes("Discord")) {
      return "@everyone Thursday's session is live! 🎯 We're covering the practical side of building with AI - bring your questions, projects, or just curiosity. 6pm, link in #events";
    }
    
    return "Generated content here...";
  }
}

export function getLLMProvider(): LLMProvider {
  const hasApiKey = !!(process.env.XAI_API_KEY || process.env.OPENAI_API_KEY);
  return hasApiKey ? new RealLLMProvider() : new MockLLMProvider();
}
