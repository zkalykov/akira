import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use API routes instead
});

export interface GeneratedWebsite {
    html: string;
    css: string;
    js: string;
    message: string;
}

export async function generateWebsite(
    userPrompt: string
): Promise<GeneratedWebsite> {
  try {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please add it to your .env.local file.");
    }

    const systemPrompt = `You are an expert web developer. Generate clean, modern HTML, CSS, and JavaScript code based on user requirements.

IMPORTANT: Your response MUST be in this exact JSON format:
{
  "html": "your HTML code here",
  "css": "your CSS code here", 
  "js": "your JavaScript code here",
  "message": "A friendly message describing what you created"
}

Rules:
- Generate complete, working code
- Use modern CSS (flexbox, grid, animations)
- Make it responsive and beautiful
- Include interactive elements where appropriate
- Don't include <!DOCTYPE>, <html>, <head>, or <body> tags in HTML - just the content
- CSS should be plain CSS without style tags
- JS should be plain JavaScript without script tags
- Keep the message friendly and concise
- Return ONLY valid JSON, no markdown code blocks or extra text`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: "system", content: systemPrompt},
                {role: "user", content: userPrompt},
            ],
            temperature: 0.7,
            max_tokens: 3000,
        });

        const response = completion.choices[0].message.content;

        if (!response) {
            throw new Error("No response from OpenAI");
        }

        // Parse the JSON response
        const result = JSON.parse(response);

        return {
            html: result.html || "",
            css: result.css || "",
            js: result.js || "",
            message: result.message || "I've created your website!",
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate website. Please try again.");
  }
}

export async function chatWithAI(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured. Please add it to your .env.local file.");
    }

    const systemPrompt = `You are Akira, a friendly AI assistant that helps users build websites. 
    
Your role:
- Help users describe what kind of website they want
- Ask clarifying questions if needed
- Be encouraging and supportive
- Keep responses concise and friendly
- When ready to generate, tell the user you'll create their website

Don't generate code in this chat - just have a conversation to understand their needs.`;

        const messages = [
            {role: "system", content: systemPrompt},
            ...conversationHistory,
            {role: "user", content: userMessage},
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages as any,
            temperature: 0.8,
            max_tokens: 500,
        });

        return (
            completion.choices[0].message.content ||
            "I'm here to help! What would you like to build?"
        );
    } catch (error) {
        console.error("OpenAI Chat Error:", error);
        return "I'm having trouble connecting right now. Please try again.";
    }
}
