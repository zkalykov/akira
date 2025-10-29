interface ChatMessageProps {
    message: string;
    sender: "user" | "ai";
    isLoading?: boolean;
}

export default function ChatMessage({
                                        message,
                                        sender,
                                        isLoading = false,
                                    }: ChatMessageProps) {
    return (
        <div
            className={`max-w-[85%] ${
                sender === "ai" ? "mr-auto" : "ml-auto"
            } rounded-2xl border ${
                sender === "ai"
                    ? "border-white/15 bg-black/40"
                    : "border-white/30 bg-white/10"
            } px-3 py-2 text-sm ${sender === "ai" ? "text-zinc-200" : ""}`}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                        <div
                            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                            style={{animationDelay: "0.1s"}}
                        ></div>
                        <div
                            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                            style={{animationDelay: "0.2s"}}
                        ></div>
                    </div>
                    <span className="text-zinc-400 text-xs">AI is thinking...</span>
                </div>
            ) : (
                message
            )}
        </div>
    );
}