"use client";

import {useState} from "react";
import Preview from "./Preview";
import ChatSidebar from "../components/chat_sidebar_props/ChatSideBarProps";
import {generateWebsite, chatWithAI} from "./WebsiteGenerationService";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    isLoading?: boolean;
}

interface WebsiteCode {
    html: string;
    css: string;
    js: string;
}

export default function Akira() {
    const [activeView, setActiveView] = useState("chat");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! I'm Akira, your AI website builder. Describe the website you want to create, and I'll help you build it!",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [websiteCode, setWebsiteCode] = useState<WebsiteCode>({
        html: "",
        css: "",
        js: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<
        Array<{ role: string; content: string }>
    >([]);
    const [shouldGenerateCode, setShouldGenerateCode] = useState(false);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessageText = inputValue.trim();

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userMessageText,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Add loading message
        const loadingMessage: Message = {
            id: "loading-" + Date.now(),
            text: "",
            sender: "ai",
            timestamp: new Date(),
            isLoading: true,
        };

        setMessages((prev) => [...prev, loadingMessage]);

        try {
            // Check if user wants to generate/build/create something
            const generateKeywords = [
                "create",
                "build",
                "make",
                "generate",
                "design",
                "develop",
            ];
            const shouldGenerate = generateKeywords.some((keyword) =>
                userMessageText.toLowerCase().includes(keyword)
            );

            if (shouldGenerate || shouldGenerateCode) {
                // Generate website code
                const result = await generateWebsite(userMessageText);

                // Remove loading message
                setMessages((prev) => prev.filter((msg) => !msg.isLoading));

                // Add AI response with code generation message
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: result.message + " Check the preview on the right!",
                    sender: "ai",
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, aiMessage]);
                setWebsiteCode({
                    html: result.html,
                    css: result.css,
                    js: result.js,
                });
                setShouldGenerateCode(false);

                // Reset conversation for next website
                setConversationHistory([]);
            } else {
                // Just chat to understand requirements
                const updatedHistory = [
                    ...conversationHistory,
                    {role: "user", content: userMessageText},
                ];

                const aiResponse = await chatWithAI(userMessageText, updatedHistory);

                // Remove loading message
                setMessages((prev) => prev.filter((msg) => !msg.isLoading));

                // Add AI response
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: aiResponse,
                    sender: "ai",
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, aiMessage]);

                // Update conversation history
                setConversationHistory([
                    ...updatedHistory,
                    {role: "assistant", content: aiResponse},
                ]);

                // Check if AI is ready to generate
                if (
                    aiResponse.toLowerCase().includes("create") ||
                    aiResponse.toLowerCase().includes("build") ||
                    aiResponse.toLowerCase().includes("generate")
                ) {
                    setShouldGenerateCode(true);
                }
            }
        } catch (error: any) {
            // Remove loading message
            setMessages((prev) => prev.filter((msg) => !msg.isLoading));

            // Show error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text:
                    error.message ||
                    "Sorry, I encountered an error. Please check your API key and try again.",
                sender: "ai",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-white/6 text-white overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                <ChatSidebar
                    activeView={activeView}
                    messages={messages}
                    inputValue={inputValue}
                    isLoading={isLoading}
                    onInputChange={setInputValue}
                    onSendMessage={handleSendMessage}
                    onPreviewClick={() => setActiveView("preview")}
                />

                <Preview
                    activeView={activeView}
                    onBackToChat={() => setActiveView("chat")}
                    html={websiteCode.html}
                    css={websiteCode.css}
                    js={websiteCode.js}
                />
            </div>
        </div>
    );
}