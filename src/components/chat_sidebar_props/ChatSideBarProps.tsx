import ChatHeader from "../chat_header_props/ChatHeadrProps";
import ChatMessage from "../chat_message/ChatMessageProps";
import ChatInput from "../chat_input_props/ChatInputProps";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatSidebarProps {
  activeView: string;
  messages: Message[];
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onPreviewClick: () => void;
}

export default function ChatSidebar({
  activeView,
  messages,
  inputValue,
  isLoading,
  onInputChange,
  onSendMessage,
  onPreviewClick,
}: ChatSidebarProps) {
  return (
    <aside
      className={`h-full overflow-hidden ${
        activeView === "chat" ? "block" : "hidden"
      } lg:block lg:border-r lg:border-gray-200`}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="h-full flex flex-col">
        <ChatHeader onPreviewClick={onPreviewClick} />

        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              sender={message.sender}
              isLoading={message.isLoading}
            />
          ))}
        </div>

        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSend={onSendMessage}
          disabled={isLoading}
        />
      </div>
    </aside>
  );
}