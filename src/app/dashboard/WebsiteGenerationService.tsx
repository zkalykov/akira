import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  message: string;
}

// Helper to inject placeholders since we are not using DALL-E anymore
function injectPlaceholders(html: string): string {
  // Simple regex to find the {{AI_IMAGE:...}} pattern and replace with a placeholder
  const regex = /src\s*=\s*["']\{\{AI_IMAGE:\s*([^}]+)\}\}["']/g;
  return html.replace(regex, (match, prompt) => {
    const keywords = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s,]/g, " ")
      .split(/\s+/)
      .filter((w: string) => w.length > 2)
      .slice(0, 6)
      .join(",");
    // Use Unsplash or a generic placeholder
    return `src="https://placehold.co/1024x1024?text=${encodeURIComponent(
      keywords || "Image"
    )}"`;
  });
}

export async function generateWebsite(
  userPrompt: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
  currentCode: string = ""
): Promise<GeneratedWebsite> {
  try {
    if (!genAI) {
      throw new Error(
        "Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file."
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const systemPrompt = `You are Akira, a website generator built by Zhyrgalbek Kalykov and Bekbolsun Samaganov.
    
    Your goal is to generate modern, beautiful, and responsive websites.
    
    INTERNAL DESIGN GUIDELINES (Follow strictly but DO NOT mention them to the user):
    - **Visual Style**: Emulate the clean, minimalist, and premium aesthetic of OpenAI's website.
    - **Typography**: Use large, clean sans-serif typography (e.g., Inter).
    - **Color Palette**: Use a stark, high-contrast palette (mostly black/white/gray) with subtle gradients or accents only when necessary.
    - **Spacing**: Use generous whitespace and padding to create a breathable layout.
    - **Responsiveness**: The site MUST be fully responsive. Use Tailwind's mobile-first classes (e.g., 'flex-col md:flex-row') for all layouts.
    
    CRITICAL REQUIREMENTS:
    1. **Modern Design**: Use high-quality, modern design principles. Use Tailwind CSS via CDN.
    2. **Single File Compatible**: The output must be capable of running as a single HTML file (HTML + CSS + JS all in one).
    3. **Identity**: If asked, your name is Akira, created by Zhyrgalbek Kalykov and Bekbolsun Samaganov.
    4. **FULL CODE ALWAYS**: You must ALWAYS return the FULL, COMPLETE code in the 'code' field, even if you are just changing one color. Do not return partial snippets. The user needs the full file to run it.

    Return ONLY valid JSON with this structure:
    {
      "text": "A brief explanation of what you changed or built (e.g. 'I've updated the background to white and adjusted the text contrast.')",
      "code": "The FULL, COMPLETE single-file HTML code (including <!DOCTYPE html>, <html>, <head>, <style>, <body>, <script>). DO NOT truncate."
    }

    Rules:
    - Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
    - Use semantic HTML.
    - Mobile-first design.
    - No markdown formatting in the response (no \`\`\`json).
    - Do NOT use markdown formatting (like * or **) in the 'text' field. Use plain text only.
    - **IMAGES**: Use "real" images by using this URL format: \`https://image.pollinations.ai/prompt/{description}\`
    - Replace \`{description}\` with a specific, relevant keyword or short phrase describing the image needed (e.g., 'coffee', 'modern office', 'coding', 'mountain landscape').
    - Example: \`<img src="https://image.pollinations.ai/prompt/modern%20minimalist%20office" alt="Office workspace" class="w-full h-64 object-cover rounded-xl" />\`
    - ALWAYS use \`object-cover\` to ensure images look good.
    `;

    // Convert history to Gemini format
    const historyParts = conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
    }));

    // Add current code context if available
    let userRequestText = systemPrompt + "\n\nUser Request: " + userPrompt;
    if (currentCode) {
        userRequestText += `\n\nCurrent Code (Modify this and return the FULL updated code):\n${currentCode}`;
    }

    // Add the current prompt
    const contents = [
        ...historyParts,
        { role: "user", parts: [{ text: userRequestText }] }
    ];

    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    console.log("Gemini raw response:", responseText);

    if (!responseText) {
      throw new Error("No response from Gemini");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (e) {
      // Try to clean up markdown if present
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "");
      parsedResult = JSON.parse(cleaned);
    }

    // Map new format to old interface for compatibility
    const fullCode = parsedResult.code || parsedResult.html || "";
    const htmlWithImages = injectPlaceholders(fullCode);

    return {
      html: htmlWithImages,
      css: "", // CSS is now embedded in HTML
      js: "",  // JS is now embedded in HTML
      message: parsedResult.text || parsedResult.message || "Website generated with Gemini!",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate website. Please try again.");
  }
}

export async function chatWithAI(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    if (!genAI) {
      throw new Error("Gemini API key is not configured.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });

    const systemPrompt = `You are Akira, a friendly AI website generator built by Zhyrgalbek Kalykov and Bekbolsun Samaganov.
    
Your role:
- Help users describe what kind of website they want.
- Ask clarifying questions if the user's request is vague (e.g. if they say "build a website", ask "What kind of website? A portfolio, landing page, or something else?").
- Be encouraging and supportive.
- Keep responses concise and friendly.
- If asked who you are, ALWAYS say you are Akira, built by Zhyrgalbek Kalykov and Bekbolsun Samaganov.
- **IMPORTANT**: Do NOT use markdown formatting (like *bold* or **bold**) in your responses. Use plain text only.

Don't generate code in this chat - just have a conversation to understand their needs.`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Akira, built by Zhyrgalbek Kalykov and Bekbolsun Samaganov. I will use plain text only." }] },
        ...conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }))],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    // Double check to remove markdown if it slipped through
    return response.replace(/\*\*/g, "").replace(/\*/g, "");
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to Gemini right now.";
  }
}

export async function classifyIntent(
  userMessage: string
): Promise<"chat" | "generate"> {
  try {
    if (!genAI) return "chat";
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-09-2025" });
    const prompt = `Classify the user's intent based on their message.
    
    User Message: "${userMessage}"
    
    Rules:
    - Return "generate" IF the user is asking to create, build, design, modify, update, change, or fix a website AND provides enough specific detail to take action (e.g., "build a portfolio", "change background to blue", "fix the header").
    - Return "chat" IF the user is asking a general question (e.g., "can you build websites?", "who are you?"), greeting, or if the request is too vague to generate code yet (e.g., "build a website", "make me something").
    - Return "chat" IF the user is just conversing.
    
    Return ONLY the string "chat" or "generate".`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();
    
    return text.includes("generate") ? "generate" : "chat";
  } catch (e) {
    console.error("Intent classification failed", e);
    return "chat"; // Default to chat on error
  }
}
