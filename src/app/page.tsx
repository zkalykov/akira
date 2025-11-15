"use client";

import { useState } from "react";
import Preview from "./Preview";

import { generateWebsite, chatWithAI } from "./WebsiteGenerationService";

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
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm Akira, Your AI website builder. Describe the website you want to create, and I'll help you build it!",
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

  // === MESSAGE HANDLER ===
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const loadingMessage: Message = {
      id: "loading-" + Date.now(),
      text: "",
      sender: "ai",
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const generateKeywords = [
        "create",
        "build",
        "make",
        "generate",
        "design",
        "develop",
      ];
      const shouldGenerate = generateKeywords.some((kw) =>
        userMessageText.toLowerCase().includes(kw)
      );

      if (shouldGenerate || shouldGenerateCode) {
        const result = await generateWebsite(userMessageText);
        setMessages((prev) => prev.filter((m) => !m.isLoading));

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.message + " Check the preview on the right!",
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setWebsiteCode({ html: result.html, css: result.css, js: result.js });
        setShouldGenerateCode(false);
        setConversationHistory([]);
      } else {
        const updatedHistory = [
          ...conversationHistory,
          { role: "user", content: userMessageText },
        ];
        const aiResponse = await chatWithAI(userMessageText, updatedHistory);
        setMessages((prev) => prev.filter((m) => !m.isLoading));

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setConversationHistory([
          ...updatedHistory,
          { role: "assistant", content: aiResponse },
        ]);

        if (
          aiResponse.toLowerCase().includes("create") ||
          aiResponse.toLowerCase().includes("build") ||
          aiResponse.toLowerCase().includes("generate")
        ) {
          setShouldGenerateCode(true);
        }
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((m) => !m.isLoading));
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text:
          error.message ||
          "Sorry, I encountered an error. Please check your API key and try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // === UI SECTION ===
  return (
    <div className="h-screen text-gray-900 overflow-hidden">
      {/* Main Split: 1/3 left, 2/3 right */}
      <div className="flex h-full">
        {/* LEFT (1/3) */}
        <div className="flex-1"></div>

        {/* RIGHT (2/3) */}
        <div className="flex-[2] flex flex-col">
          {/* RIGHT TOP (flex 1) */}
          <div className="flex-1 border-b border-gray-200 p-2">
            {/* Back Button for Mobile */}
            <button
              onClick={() => setActiveView("chat")}
              className="lg:hidden absolute top-4 left-4 z-20 flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-medium text-sm px-4 py-2 rounded-lg transition border border-gray-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Chat</span>
            </button>
          </div>

          {/* RIGHT BOTTOM (flex 10) */}
          <div className="flex-[20] overflow-hidden bg-white">
            <div className="h-full w-full overflow-y-auto">
              <Preview
                activeView={activeView}
                onBackToChat={() => setActiveView("chat")}
                html={websiteCode.html}
                css={websiteCode.css}
                js={websiteCode.js}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
