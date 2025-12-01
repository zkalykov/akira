"use client";

import { useEffect, useRef } from "react";

interface PreviewProps {
  activeView: string;
  onBackToChat: () => void;
  html: string;
  css: string;
  js: string;
  isMobileView?: boolean;
}

export default function Preview({
  activeView,
  onBackToChat,
  html,
  css,
  js,
  isMobileView = false,
}: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const document = iframe.contentDocument;

      if (document) {
        let fullPage = "";
        
        // If the HTML seems to be a full document, use it directly
        if (html.trim().toLowerCase().startsWith("<!doctype html") || html.trim().toLowerCase().startsWith("<html")) {
            fullPage = html;
        } else {
            // Otherwise wrap it (legacy support or partial updates)
            fullPage = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
        }

        document.open();
        document.write(fullPage);
        document.close();
      }
    }
  }, [html, css, js]);

  return (
    <section
      className="h-full w-full p-3 md:p-5 overflow-hidden flex justify-center items-center bg-gray-100"
    >
      <div
        className={`relative transition-all duration-300 ease-in-out bg-white ${
          isMobileView
            ? "w-[375px] h-[667px] rounded-[3rem] border-[8px] border-gray-900 shadow-2xl"
            : "w-full h-full rounded-2xl border border-gray-200 shadow-sm"
        } overflow-hidden`}
      >
        <div className="h-full w-full bg-white">
          {html || css || js ? (
            <iframe
              ref={iframeRef}
              title="Website Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">Preview will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
