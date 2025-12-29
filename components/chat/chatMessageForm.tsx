"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessageFormProps {
  initialMessage?: string;
  onMessageChange?: (message: string) => void;
}

const ChatMessageForm = ({
  initialMessage,
  onMessageChange,
}: ChatMessageFormProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialMessage) {
      // Use a timeout to avoid synchronous state update in effect warning
      const timer = setTimeout(() => {
        setMessage(initialMessage);
        onMessageChange?.("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    try {
      e.preventDefault();
      console.log("Message sent:", message);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 md:px-4 pb-4 md:pb-6">
      <form onSubmit={handleSubmit}>
        <div
          className="relative rounded-2xl border border-border shadow-sm transition-all bg-background
            "
        >
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[60px] md:min-h-15 max-h-50 resize-none border-0 bg-transparent px-4 py-3 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 "
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t">
            {/* Model Selector */}
            <div className="flex items-center gap-1">
              <Button
                variant={"outline"}
                type="button"
                size="sm"
                className="text-xs md:text-sm h-8"
              >
                Select a Model
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!message.trim()}
              size="sm"
              variant={message.trim() ? "default" : "ghost"}
              className="h-8 w-8 p-0 rounded-full "
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageForm;
