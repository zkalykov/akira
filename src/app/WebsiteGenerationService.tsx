import OpenAI from "openai";

// Initialize OpenAI client - reads from .env.local automatically
const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
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

        const systemPrompt = `You are an expert senior full-stack web developer and UX architect. Your job is to generate high-quality HTML, CSS, and JavaScript code based on user instructions.

Your output MUST follow **exact JSON format**:

{
  "html": "HTML content here",
  "css": "CSS styles here",
  "js": "JavaScript here",
  "message": "Friendly message summarizing output"
}

--------------------
REQUIREMENTS
--------------------
GENERAL
- Always generate complete, well-structured, production-quality code.
- Even if user gives very short instructions, produce a **rich, thoughtful, full-featured website**.
- Code MUST be functional and visually appealing.
- Use clean semantics: sections, headers, main, footer, nav, etc.
- All content MUST be responsive (mobile, tablet, desktop).

HTML
- DO NOT include <html>, <head>, <body>, or <!DOCTYPE>.
- MUST include:
  * Navigation bar
  * Hero / Intro section
  * About section with meaningful biography
  * Skills section with categorized skill cards + optional proficiency indicators
  * Projects section with cards (title, description, technology tags, optional link buttons)
  * Experience / Timeline section
  * Testimonials section
  * Contact section with a real form
  * Footer section
- Ideally include OPTIONAL extra sections:
  * Blog preview / articles cards
  * Certifications / awards
  * Achievements with metrics (e.g. “10+ completed apps”)
- Add placeholder/default content when not provided.
- Include call-to-action buttons.

CSS
- Use modern styling:
  * Flexbox, Grid, subtle shadows, transitions, hover states
  * Minimalistic modern design
  * Consistent spacing and font scales
- Include:
  * Responsive breakpoints
  * Smooth animations
  * Attractive color palette
- Avoid Tailwind (plain CSS only).

JS
- Add interactive functionality:
  * Mobile nav toggle
  * Smooth scrolling
  * Form validation
  * Optional animations/interactivity
- Write plain JavaScript only (no frameworks).

MESSAGE
- Short, friendly summary of what was created.

--------------------
STRICT RULES
--------------------
- Return ONLY valid JSON — NO markdown or explanations outside JSON
- "html", "css", and "js" fields must contain only code (no commentary)
- If user input is unclear, make reasonable assumptions and fill in defaults
- Generate content that looks complete and professional

--------------------
QUALITY EXPECTATION
--------------------
When user asks “simple portfolio”, you still generate:
- Multiple complete sections
- Detailed placeholder text
- Strong UX and structure
- Interactive behavior
- Elegant styling
- Professional and thoughtful layouts

ALWAYS build a complete, professional-grade result.
`;

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