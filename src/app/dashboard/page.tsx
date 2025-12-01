"use client";

import { useState, useRef, useEffect, type FormEventHandler, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Preview from "./Preview";

import {
  generateWebsite,
  chatWithAI,
  classifyIntent,
  type GeneratedWebsite,
} from "./actions";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ui/shadcn-io/ai/prompt-input";
import { MicIcon, PaperclipIcon, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AkiraLogo } from "@/components/ui/AkiraLogo";

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
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AkiraContent />
    </Suspense>
  );
}

function AkiraContent() {
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
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
  const [promptText, setPromptText] = useState<string>("");
  const [model, setModel] = useState<string>("gemini-2.5-flash");
  const [promptStatus, setPromptStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasAutoSentRef = useRef(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // === PERSISTENCE HANDLERS ===
  // Load from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("akira_messages");
    const savedCode = localStorage.getItem("akira_website_code");
    const savedHistory = localStorage.getItem("akira_conversation_history");

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp), // Rehydrate Date object
        }));
        setMessages(parsedMessages);
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }

    if (savedCode) {
      try {
        setWebsiteCode(JSON.parse(savedCode));
      } catch (e) {
        console.error("Failed to parse saved code", e);
      }
    }

    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse saved history", e);
      }
    }
    
    setIsHydrated(true);
  }, []);

  // === AUTO-SEND FROM URL ===
  useEffect(() => {
    const q = searchParams.get("q");
    if (isHydrated && q && !hasAutoSentRef.current && !isLoading) {
      hasAutoSentRef.current = true;
      // Clear the query param immediately to prevent re-sending on reload
      router.replace("/dashboard");
      
      // Send the message
      handleSendMessageWithText(q);
    }
  }, [searchParams, isLoading, router, isHydrated]);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("akira_messages", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (websiteCode.html || websiteCode.css || websiteCode.js) {
      localStorage.setItem("akira_website_code", JSON.stringify(websiteCode));
    }
  }, [websiteCode]);

  useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem("akira_conversation_history", JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const models = [
    { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  ];

  // === PROMPT INPUT HANDLER ===
  const handlePromptSubmit: FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    if (!promptText.trim() || isLoading) {
      return;
    }

    const userMessageText = promptText.trim();
    setPromptText("");
    setPromptStatus("submitted");

    // Use the prompt text directly
    await handleSendMessageWithText(userMessageText);
  };

  // === MESSAGE HANDLER ===
  const handleSendMessageWithText = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessageText = messageText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setPromptStatus("streaming");

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
        // Pass the conversation history to the generator so it knows context (e.g. "change color")
        const updatedHistory = [
          ...conversationHistory,
          { role: "user", content: userMessageText },
        ];
        
        const result = await generateWebsite(userMessageText, updatedHistory, websiteCode.html);
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
        
        // Keep history so user can continue refining
        setConversationHistory([
          ...updatedHistory,
          { role: "model", content: `Generated website: ${result.message}` },
        ]);
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
      setPromptStatus("ready");
    }
  };

  // === MESSAGE HANDLER (for backward compatibility) ===
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    await handleSendMessageWithText(inputValue);
  };

  // === DOWNLOAD HANDLER ===
  const handleDownload = () => {
    if (!websiteCode.html) return;
    
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${websiteCode.css}</style>
</head>
<body>
    ${websiteCode.html}
    <script>${websiteCode.js}</script>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "akira-website.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // === CLEAR DATA HANDLER ===
  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This will delete your chat history and generated website.")) {
      localStorage.removeItem("akira_messages");
      localStorage.removeItem("akira_website_code");
      localStorage.removeItem("akira_conversation_history");
      window.location.reload();
    }
  };

  // === UI SECTION ===
  return (
    <div className="h-[100dvh] md:h-screen text-gray-900 overflow-hidden">
      {/* Main Split: 1/3 left, 2/3 right */}
      <div className="flex h-full">
        {/* LEFT (1/3) - Hidden on mobile when preview is shown */}
        <div
          className={`flex-1 border-r border-l flex flex-col relative ${
            showPreview ? "hidden md:flex" : "flex"
          }`}
        >
          {/* LEFT TOP (flex 1) */}
          <div className="pl-5 pr-5 flex-none border-b border-gray-200/50 p-2 h-14 flex items-center justify-between relative bg-white/80 backdrop-blur-md z-10">
            {/* LEFT: Dashboard Button */}
            <Button 
              variant="ghost" 
              className="group flex items-center gap-0 md:gap-2 pl-2 pr-2 md:pr-4 py-2 h-10 rounded-full hover:bg-gray-100/80 transition-all duration-200" 
              asChild
            >
              <a href="https://akira-landing-page.vercel.app/dashboard">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:border-primary/30 group-hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </div>
                <span className="hidden md:inline text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">Dashboard</span>
              </a>
            </Button>

            {/* RIGHT: Profile & Mobile Preview */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="md:hidden text-primary hover:bg-primary/10 hover:text-primary gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                </svg>
                Preview
              </Button>

              {/* Logo & Profile Group */}
              <div className="flex items-center gap-2">
                <AkiraLogo className="w-auto h-8 md:h-9 text-primary" />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all"
                    >
                      <div className="h-full w-full bg-gradient-to-br from-[#3b0764] to-[#dc2626] flex items-center justify-center text-white font-medium">
                        {/* Gradient Circle matching the image (Deep Purple/Blue to Red) */}
                        <span className="sr-only">Profile</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 mr-4" align="end">
                  <div className="flex items-center space-x-2 p-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3b0764] to-[#dc2626]" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">@Akira</h4>
                      <p className="text-xs text-muted-foreground">
                        akira@akira.com
                      </p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="grid gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      size="sm"
                      onClick={handleClearData}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      Clear Data
                    </Button>
                    <Separator className="my-1" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              </div>
            </div>
          </div>
          {/* LEFT BOTTOM (flex 1) - Chat Area */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white scroll-smooth">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area - Fixed at bottom of left panel */}
          <div className="flex-none p-4 bg-white border-t border-gray-100 z-20">
            <div className="max-w-3xl mx-auto shadow-sm rounded-xl overflow-hidden border border-gray-200 bg-white">
            <PromptInput onSubmit={handlePromptSubmit}>
              <PromptInputTextarea
                onChange={(e) => setPromptText(e.target.value)}
                value={promptText}
                placeholder="Type your message..."
              />
              <PromptInputToolbar>
                <PromptInputTools>
                  <PromptInputButton>
                    <PaperclipIcon size={16} />
                  </PromptInputButton>
                  <PromptInputButton>
                    <MicIcon size={16} />
                    <span>Voice</span>
                  </PromptInputButton>
                  <PromptInputModelSelect
                    onValueChange={setModel}
                    value={model}
                  >
                    <PromptInputModelSelectTrigger>
                      <PromptInputModelSelectValue />
                    </PromptInputModelSelectTrigger>
                    <PromptInputModelSelectContent>
                      {models.map((modelOption) => (
                        <PromptInputModelSelectItem
                          key={modelOption.id}
                          value={modelOption.id}
                        >
                          {modelOption.name}
                        </PromptInputModelSelectItem>
                      ))}
                    </PromptInputModelSelectContent>
                  </PromptInputModelSelect>
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={!promptText}
                  status={promptStatus}
                />
              </PromptInputToolbar>
            </PromptInput>
            </div>
          </div>
        </div>

        {/* RIGHT (2/3) - Full screen on mobile when preview is shown */}
        <div
          className={`flex-[2] flex flex-col ${
            showPreview ? "flex" : "hidden md:flex"
          }`}
        >
          {/* RIGHT TOP (flex 1) */}
          <div className="flex-none border-b border-gray-200 p-2 h-14">
            {/* Make following div align left but gap between 5px */}
            <div className="flex justify-between md:justify-start items-center gap-2 w-full md:w-auto">
              {/* Mobile Previous Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
                className="md:hidden text-gray-600 hover:text-primary hover:bg-primary/5 -ml-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`hidden md:flex items-center gap-2 text-gray-600 hover:text-primary hover:bg-primary/5 transition-all rounded-full px-4 ${isMobileView ? "bg-primary/5 text-primary font-medium" : ""}`}
                  onClick={() => setIsMobileView(!isMobileView)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {isMobileView ? "Desktop View" : "Mobile View"}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all rounded-full px-5"
                  onClick={() => setIsPublishModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 md:mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden md:inline">Publish</span>
                  <span className="md:hidden">Publish</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden md:flex border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all rounded-full px-4"
                  onClick={handleDownload}
                  disabled={!websiteCode.html}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                  </svg>
                  Download
                </Button>
              </div>
            </div>
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
                isMobileView={isMobileView}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Publish Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Ready to Publish?</h2>
              <p className="text-sm text-gray-500 mt-1">
                Your website is ready to go live. Please review the final details before publishing.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Project Name</label>
                <input 
                  type="text" 
                  placeholder="My Awesome Website" 
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 border border-gray-100">
                <div className="flex justify-between py-1">
                  <span className="font-medium">Deployment Target:</span>
                  <span>Vercel</span>
                </div>
                <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                  <span className="font-medium">Estimated Cost:</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsPublishModalOpen(false)} className="text-primary hover:bg-primary/10">
                Cancel
              </Button>
              <Button onClick={() => setIsPublishModalOpen(false)} className="bg-primary hover:bg-primary/90 text-white">
                Confirm Publish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
