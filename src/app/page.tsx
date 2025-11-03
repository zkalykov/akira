"use client";

import { useState } from "react";

export default function Akira() {
  const [activeView, setActiveView] = useState<"chat" | "preview">("chat");
  const [menuOpen, setMenuOpen] = useState(false);
  // TEST 1
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
                      <li
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 text-gray-900 hover:bg-gray-50 cursor-pointer text-sm font-medium border-b border-gray-100"
                      >
                        Profile
                      </li>
                      <li
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 text-gray-900 hover:bg-gray-50 cursor-pointer text-sm font-medium border-b border-gray-100"
                      >
                        Settings
                      </li>
                      <li
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 text-gray-900 hover:bg-gray-50 cursor-pointer text-sm font-medium"
                      >
                        Logout
                      </li>
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Chat Messages */}
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
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        </aside>

        <section
          className={`h-full overflow-hidden ${
            activeView === "preview" ? "block" : "hidden"
          } lg:block lg:col-span-2`}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div className="h-full">
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

            <div className="h-full overflow-y-auto">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight justify-center flex h-screen items-center text-gray-900">
                Build and deploy on the AI Cloud.
              </h1>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
