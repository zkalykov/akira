interface ChatHeaderProps {
    onPreviewClick: () => void;
}

export default function ChatHeader({onPreviewClick}: ChatHeaderProps) {
    return (
        <div className="flex items-center gap-2 px-4 pt-4">
            <div className="h-3 w-3 rounded-full bg-green-500"/>
            <span className="text-xs font-bold tracking-widest uppercase text-white/80">
        akira beta
      </span>

            <button
                className="ml-auto flex items-center gap-1 bg-green-800 hover:bg-green-700 text-white font-bold text-sm px-3 py-1 rounded-lg transition group hover:cursor-pointer">
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

            <button
                onClick={onPreviewClick}
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
                    <summary
                        className="cursor-pointer select-none bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 text-xs px-2.5 py-1.5 rounded-md transition flex items-center gap-1">
                        <div className="space-y-0.5">
                            <div className="w-3 h-0.5 bg-white/80"></div>
                            <div className="w-3 h-0.5 bg-white/80"></div>
                            <div className="w-3 h-0.5 bg-white/80"></div>
                        </div>
                    </summary>

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
    );
}