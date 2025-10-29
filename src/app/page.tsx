"use client";

import {useState} from "react";
import Preview from "./Preview";
import ChatSidebar from "../components/chat_sidebar_props/ChatSideBarProps";

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

// Template examples for testing
const templates = {
    landing: {
        html: `
      <div class="container">
        <header>
          <h1>AI Tool</h1>
          <p class="tagline">Revolutionize Your Workflow</p>
        </header>
        <main>
          <section class="hero">
            <h2>Build and deploy on the AI Cloud</h2>
            <p>Transform your ideas into reality with our cutting-edge AI platform.</p>
            <button class="cta-button">Get Started</button>
          </section>
          <section class="features">
            <div class="feature">
              <h3>🚀 Fast</h3>
              <p>Lightning-fast deployment</p>
            </div>
            <div class="feature">
              <h3>🎯 Accurate</h3>
              <p>Precise AI predictions</p>
            </div>
            <div class="feature">
              <h3>🔒 Secure</h3>
              <p>Enterprise-grade security</p>
            </div>
          </section>
        </main>
      </div>
    `,
        css: `
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .container {
        max-width: 1200px;
        padding: 2rem;
      }
      header {
        text-align: center;
        margin-bottom: 3rem;
      }
      header h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
        font-weight: 700;
      }
      .tagline {
        font-size: 1.25rem;
        opacity: 0.9;
      }
      .hero {
        text-align: center;
        margin-bottom: 4rem;
      }
      .hero h2 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      .hero p {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        opacity: 0.9;
      }
      .cta-button {
        background: white;
        color: #667eea;
        border: none;
        padding: 1rem 2.5rem;
        font-size: 1.125rem;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }
      .feature {
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(10px);
        padding: 2rem;
        border-radius: 1rem;
        text-align: center;
        transition: transform 0.2s;
      }
      .feature:hover {
        transform: translateY(-5px);
      }
      .feature h3 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      .feature p {
        opacity: 0.9;
      }
    `,
        js: `
      document.querySelector('.cta-button').addEventListener('click', function() {
        alert('Welcome to the AI Tool! 🚀');
      });
      
      const features = document.querySelectorAll('.feature');
      features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(20px)';
        setTimeout(() => {
          feature.style.transition = 'opacity 0.5s, transform 0.5s';
          feature.style.opacity = '1';
          feature.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
      });
    `,
    },
};

export default function Akira() {
    const [activeView, setActiveView] = useState("chat");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! Describe the site you want.",
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

    const handleSendMessage = () => {
        if (!inputValue.trim() || isLoading) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
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

        // Simulate AI response with code generation (2-3 seconds delay)
        setTimeout(() => {
            // Remove loading message
            setMessages((prev) => prev.filter((msg) => !msg.isLoading));

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I've created a landing page for your AI tool. Check the preview!",
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);

            // Generate code
            setWebsiteCode(templates.landing);
        }, 2500);
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