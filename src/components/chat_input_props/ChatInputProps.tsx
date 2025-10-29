interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
}

export default function ChatInput({
                                      value,
                                      onChange,
                                      onSend,
                                      disabled = false,
                                  }: ChatInputProps) {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !disabled) {
            onSend();
        }
    };

    return (
        <div className="border-t border-white/10 px-4 py-4 flex items-center gap-2">
            <input
                className="flex-1 rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Type a message…"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={disabled}
            />
            <button
                type="button"
                onClick={onSend}
                disabled={disabled}
                className="rounded-lg border border-white/30 px-3 py-1.5 text-sm hover:border-white/50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {disabled ? "..." : "Send"}
            </button>
        </div>
    );
}