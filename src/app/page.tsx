"use client";

import { useState } from "react";

export default function Akira() {
  const [activeView, setActiveView] = useState("chat"); // 'chat' or 'preview'

  return (
    <div className="h-screen bg-white/6 text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
        {/* LEFT: Chat (1/3) */}
        <aside
          className={`h-full p-3 md:p-5 overflow-hidden ${
            activeView === "chat" ? "block" : "hidden"
          } lg:block`}
        >
          <div className="relative h-full rounded-[18px] border border-white/30 bg-black overflow-hidden flex flex-col">
            {/* header */}
            <div className="flex items-center gap-2 px-4 pt-4">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/80">
                akira beta
              </span>

              <button className="ml-auto flex items-center gap-1 bg-green-800 hover:bg-green-700 text-white font-bold text-sm px-3 py-1 rounded-lg transition group hover:cursor-pointer">
                <span>Publish</span>
                <svg
                  className="w-3 h-3 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17L17 7M17 7H9m8 0v8"
                  />
                </svg>
              </button>

              {/* Mobile Preview Toggle */}
              <button
                onClick={() => setActiveView("preview")}
                className="lg:hidden flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-3 py-1 rounded-lg transition"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Preview</span>
              </button>

              <div className="relative inline-block text-right">
                <details className="group">
                  {/* HAMBURGER BUTTON */}
                  <summary className="cursor-pointer select-none bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 text-xs px-2.5 py-1.5 rounded-md transition flex items-center gap-1">
                    <div className="space-y-0.5">
                      <div className="w-3 h-0.5 bg-white/80"></div>
                      <div className="w-3 h-0.5 bg-white/80"></div>
                      <div className="w-3 h-0.5 bg-white/80"></div>
                    </div>
                  </summary>

                  {/* DROPDOWN PANEL */}
                  <ul className="absolute right-0 mt-2 w-36 bg-black/80 backdrop-blur-md border border-white/10 rounded-md shadow-xl z-50">
                    <li className="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm">
                      Profile
                    </li>
                    <li className="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm">
                      Settings
                    </li>
                    <li className="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm">
                      Logout
                    </li>
                  </ul>
                </details>
              </div>
            </div>

            {/* messages (scroll only inside messages, not whole page) */}
            <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4">
              <div className="max-w-[85%] mr-auto rounded-2xl border border-white/15 bg-black/40 px-3 py-2 text-sm text-zinc-200">
                Hi! Describe the site you want.
              </div>
              <div className="max-w-[85%] ml-auto rounded-2xl border border-white/30 bg-white/10 px-3 py-2 text-sm">
                Make a landing page for an AI tool.
              </div>
            </div>
            {/* input (fixed bottom) */}
            <div className="border-t border-white/10 px-4 py-4 flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-500"
                placeholder="Type a message…"
              />
              <button
                type="button"
                className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:border-white/50 transition cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT: Preview (2/3) */}
        <section
          className={`h-full p-3 md:p-5 overflow-hidden ${
            activeView === "preview" ? "block" : "hidden"
          } lg:block lg:col-span-2`}
        >
          <div className="relative h-full rounded-[18px] border border-white/30 bg-black overflow-hidden">
            {/* Back to Chat Button (Mobile Only) */}
            <button
              onClick={() => setActiveView("chat")}
              className="lg:hidden absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white font-medium text-sm px-4 py-2 rounded-lg transition border border-white/20"
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

            {/* ✅ ONLY THIS PART SCROLLS */}
            <div className="relative z-10 h-full overflow-y-auto">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight justify-center flex h-screen items-center">
                Build and deploy on the AI Cloud.
              </h1>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
