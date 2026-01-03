"use client";
import React, { useState } from "react";
import ChatWelcomeTabs from "./chatWelcomeTabs";
import ChatMessageForm from "./chatMessageForm";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ChatMessageViewProps {
  user?: User | null;
}

const ChatMessageView = ({ user }: ChatMessageViewProps) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message: string) => {
    setSelectedMessage(message);
  };

  const handleMessageChange = () => {
    setSelectedMessage("");
  };

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
