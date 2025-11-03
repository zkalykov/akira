"use client";

import { useState } from "react";

export default function Akira() {
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");

  return (
    <div className="h-screen bg-white text-gray-900 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
        {/* LEFT: Chat (restyled, white bg, HyperUI-like text & borders) */}
        <aside
          className={`h-full p-3 md:p-5 overflow-hidden ${
            activeView === "chat" ? "block" : "hidden"
          } lg:block`}
        >
          <div className="relative h-full rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 pt-4">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-600">
                akira beta
              </span>

              <button className="ml-auto flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-3 py-1 rounded-lg transition">
                <span>Publish</span>
                <svg
                  className="w-3 h-3"
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

              <button
                onClick={() => setActiveView("preview")}
                className="lg:hidden ml-2 flex items-center gap-1 bg-gray-900 hover:bg-black text-white font-semibold text-sm px-3 py-1 rounded-lg transition"
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

              {/* Kebab */}
              <div className="relative inline-block text-right">
                <details className="group">
                  <summary className="cursor-pointer select-none bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs px-2.5 py-1.5 rounded-md transition flex items-center gap-1">
                    <div className="space-y-0.5">
                      <div className="w-3 h-0.5 bg-gray-700" />
                      <div className="w-3 h-0.5 bg-gray-700" />
                      <div className="w-3 h-0.5 bg-gray-700" />
                    </div>
                  </summary>

                  <ul className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-xl z-50">
                    <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer text-sm">
                      Profile
                    </li>
                    <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer text-sm">
                      Settings
                    </li>
                    <li className="px-3 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer text-sm">
                      Logout
                    </li>
                  </ul>
                </details>
              </div>
            </div>

            {/* Chat messages (white bg kept; soft borders, dark text) */}
            <div className="flex-1 overflow-y-auto space-y-4 px-5 py-6">
              <div className="max-w-[85%] mr-auto rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800">
                Hi! Describe the site you want.
              </div>
              <div className="max-w-[85%] ml-auto rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900">
                Make a landing page for an AI tool.
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-4 py-4 flex items-center gap-2">
              <input
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200"
                placeholder="Type a message…"
              />
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition"
              >
                Send
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT: Preview (unchanged from your original) */}
        <section
          className={`h-full p-3 md:p-5 overflow-hidden ${
            activeView === "preview" ? "block" : "hidden"
          } lg:block lg:col-span-2`}
        >
          <div className="relative h-full rounded-[18px] border border-white/30 bg-black overflow-hidden">
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

            <div className="relative z-10 h-full overflow-y-auto">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight justify-center flex h-screen items-center text-white">
                Build and deploy on the AI Cloud.
              </h1>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
