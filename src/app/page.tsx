"use client";

import { useState, type FormEventHandler } from "react";
import Preview from "./Preview";

import { generateWebsite, chatWithAI } from "./WebsiteGenerationService";
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
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
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
  const [model, setModel] = useState<string>("gpt-4o");
  const [promptStatus, setPromptStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");

  const models = [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  ];

  // === PROMPT INPUT HANDLER ===
  const handlePromptSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
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
      setPromptStatus("ready");
    }
  };

  // === MESSAGE HANDLER (for backward compatibility) ===
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    await handleSendMessageWithText(inputValue);
  };

  // === UI SECTION ===
  return (
    <div className="h-screen text-gray-900 overflow-hidden">
      {/* Main Split: 1/3 left, 2/3 right */}
      <div className="flex h-full">
        {/* LEFT (1/3) - Hidden on mobile when preview is shown */}
        <div className={`flex-1 border-r flex flex-col ${showPreview ? 'hidden md:flex' : 'flex'}`}>
          {/* LEFT TOP (flex 1) */}
          <div className="pl-5 flex-none border-b border-gray-200 p-2 h-14 flex items-center justify-between relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 ml-3" align="end">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">@shadcn</h4>
                    <p className="text-xs text-muted-foreground">
                      shadcn@example.com
                    </p>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="grid gap-1">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Separator className="my-1" />
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <AkiraLogo className="w-100 h-10" />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(true)}
              className="md:hidden"
            >
              Preview
            </Button>
          </div>
          {/* LEFT BOTTOM (flex 20) */}
          <div className="flex-[20] overflow-y-auto p-4">
            {/* Messages area - you can add your chat messages here */}
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
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
                <PromptInputSubmit disabled={!promptText} status={promptStatus} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>

        {/* RIGHT (2/3) - Full screen on mobile when preview is shown */}
        <div className={`flex-[2] flex flex-col ${showPreview ? 'flex' : 'hidden md:flex'}`}>
          {/* RIGHT TOP (flex 1) */}
          <div className="flex-none border-b border-gray-200 p-2 h-14">
            {/* Make following div align left but gap between 5px */}
            <div className="flex justify-start items-center gap-[5px]">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                className="md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
                Close View
              </Button>
              <Button variant="outline" disabled className="hidden md:inline-flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
                Close View
              </Button>
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path
                    fillRule="evenodd"
                    d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                Mobile View
              </Button>
              <Button variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                    clipRule="evenodd"
                  />
                </svg>
                Publish
              </Button>
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
