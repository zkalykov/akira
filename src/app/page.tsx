"use client";

import { useState } from "react";
import Preview from "./Preview";
import ChatSidebar from "../components/chat_sidebar_props/ChatSideBarProps";
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

  // === MESSAGE HANDLER (kept 100% same logic) ===
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

  // === UI SECTION (Your New Design) ===
  return (
    <div
      className="h-screen text-gray-900 overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
        {/* LEFT: Chat Section */}
        <aside
          className={`h-full overflow-hidden ${
            activeView === "chat" ? "block" : "hidden"
          } lg:block lg:border-r lg:border-gray-200`}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-4 pb-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-600">
                akira beta
              </span>

              <button className="ml-auto flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-medium text-sm px-4 py-2 rounded-full transition-all hover:scale-105 cursor-pointer">
                <span>Publish</span>
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>

              <button
                onClick={() => setActiveView("preview")}
                className="lg:hidden ml-2 flex items-center gap-1 bg-gray-900 hover:bg-black text-white font-semibold text-sm px-3 py-1 rounded-lg transition cursor-pointer"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Preview</span>
              </button>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg transition-colors cursor-pointer"
                >
                  <svg
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                      {["Profile", "Settings", "Logout"].map((item) => (
                        <li
                          key={item}
                          onClick={() => setMenuOpen(false)}
                          className="px-4 py-3 text-gray-900 hover:bg-gray-50 cursor-pointer text-sm font-medium border-b last:border-0 border-gray-100"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 px-5 py-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] ${
                    msg.sender === "user"
                      ? "ml-auto border-gray-300"
                      : "mr-auto border-gray-200"
                  } rounded-2xl border bg-white px-4 py-2.5 text-sm text-gray-900`}
                >
                  {msg.isLoading ? (
                    <span className="animate-pulse text-gray-400">...</span>
                  ) : (
                    msg.text
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-4 py-4 flex items-center gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="Type a message…"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </aside>

        {/* PREVIEW */}
        <section
          className={`h-full overflow-hidden ${
            activeView === "preview" ? "block" : "hidden"
          } lg:block lg:col-span-2`}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="h-full relative">
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

            {/* Preview Display */}
            <div className="h-full overflow-y-auto flex items-center justify-center px-4">
              {websiteCode.html || websiteCode.css || websiteCode.js ? (
                <Preview
                  activeView={activeView}
                  onBackToChat={() => setActiveView("chat")}
                  html={websiteCode.html}
                  css={websiteCode.css}
                  js={websiteCode.js}
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight justify-center flex h-screen items-center text-gray-900">
                  Build and deploy on the AI Cloud.
                </h1>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
