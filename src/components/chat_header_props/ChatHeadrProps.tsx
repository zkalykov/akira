interface ChatHeaderProps {
    onPreviewClick: () => void;
  }
  
  export default function ChatHeader({ onPreviewClick }: ChatHeaderProps) {
    return (
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
          onClick={onPreviewClick}
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
  
        <div className="relative inline-block text-right">
          <details className="group">
            <summary className="cursor-pointer select-none p-2 rounded-lg transition-colors list-none flex items-center">
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
            </summary>
  
            <ul className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50 overflow-hidden">
              {["Profile", "Settings", "Logout"].map((item) => (
                <li
                  key={item}
                  className="px-4 py-3 bg-gray-900 cursor-pointer text-gray-200 text-sm font-medium border-b border-gray-100 last:border-0 first:rounded-t-[10px] last:rounded-b-[10px] hover:bg-gray-800 transition-colors"
                >
                  <span className="inline-block transition-transform duration-200 hover:scale-110">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    );
  }