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
            className={`h-full p-3 md:p-5 overflow-hidden ${
                activeView === "chat" ? "block" : "hidden"
            } lg:block`}
        >
            <div
                className="relative h-full rounded-[18px] border border-white/30 bg-black overflow-hidden flex flex-col">
                <ChatHeader onPreviewClick={onPreviewClick}/>

                <div className="flex-1 overflow-y-auto space-y-3 px-4 py-4">
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