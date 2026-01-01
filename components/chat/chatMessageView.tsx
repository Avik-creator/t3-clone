"use client";
import React, { useState } from "react";
import ChatWelcomeTabs from "./chatWelcomeTabs";
import ChatMessageForm from "./chatMessageForm";

interface Message {
  id: string;
  content: string;
  messageRole: string;
  createdAt: Date;
}

interface ChatMessageViewProps {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  messages?: Message[];
}

const ChatMessageView = ({ user, messages = [] }: ChatMessageViewProps) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
  };

  const handleMessageChange = () => {
    setSelectedMessage("");
  };

  // If there are messages, show the chat view
  if (messages.length > 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.messageRole === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${message.messageRole === 'USER'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                  }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t bg-background p-4">
          <ChatMessageForm
            initialMessage={selectedMessage}
            onMessageChange={handleMessageChange}
          />
        </div>
      </div>
    );
  }

  // If no messages, show welcome screen
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4 md:space-y-10 py-4 md:py-8">
      <div className="flex-1 flex flex-col items-center justify-center w-full overflow-y-auto">
        <ChatWelcomeTabs
          userName={user?.name || user?.email || "User"}
          onMessageSelect={handleMessageSelect}
        />
      </div>
      <div className="w-full shrink-0">
        <ChatMessageForm
          initialMessage={selectedMessage}
          onMessageChange={handleMessageChange}
        />
      </div>
    </div>
  );
};

export default ChatMessageView;
