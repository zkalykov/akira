"use client";

import { useEffect, useRef } from "react";

interface PreviewProps {
  activeView: string;
  onBackToChat: () => void;
  html: string;
  css: string;
  js: string;
}

export default function Preview({
  activeView,
  onBackToChat,
  html,
  css,
  js,
}: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const document = iframe.contentDocument;

      if (document) {
        const fullPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html, body {
        width: 100%;
        height: 100%;
        font-family: system-ui, -apple-system, sans-serif;
      }
      ${css}
    </style>
  </head>
  <body>
    ${html}
    <script>
      try {
        ${js}
      } catch (error) {
        console.error('Script error:', error);
      }
    </script>
  </body>
</html>`;

        document.open();
        document.write(fullPage);
        document.close();
      }
    }
  }, [html, css, js]);

  return (
    <section
      className={`h-full w-full p-3 md:p-5 overflow-hidden ${
        activeView === "preview" ? "block" : "hidden"
      } lg:block lg:col-span-2`}
    >
      <div className="relative h-full w-full rounded-[18px] border border-white/30 overflow-hidden">
        <button
          onClick={onBackToChat}
          className="lg:hidden absolute top-4 left-4 z-20 flex items-center gap-2 backdrop-blur-sm text-white font-medium text-sm px-4 py-2 rounded-lg transition border border-white/20"
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

        <div className="">
          {html || css || js ? (
            <iframe
              ref={iframeRef}
              title="Website Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <h1 className="">Preview will appear here</h1>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
