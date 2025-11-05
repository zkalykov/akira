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
      <div className="border-t border-gray-200 px-4 py-4 flex items-center gap-2">
        <input
          className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? "..." : "Send"}
        </button>
      </div>
    );
  }