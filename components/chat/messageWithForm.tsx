"use client";
// Using direct API calls instead of useChat hook
import { useGetChatById } from "@/hooks/ai-agent";
import { Fragment, useState, useEffect, useMemo } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "@/components/chat/modelSelector";
import { useAIModels } from "@/hooks/ai-agent";
import { useChatStore } from "@/store/chatStore";

import { RotateCcwIcon, StopCircleIcon } from "lucide-react";

interface MessageWithFormProps {
  chatId: string;
}

const MessageWithForm = ({ chatId }: MessageWithFormProps) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);

  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");

  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) return [];

    return data.data.messages
      .filter((msg) => msg.content && msg.content.trim() !== "" && msg.id)
      .map((msg) => {
        try {
          const parts = JSON.parse(msg.content);

          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: Array.isArray(parts)
              ? parts
              : [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        } catch (error) {
          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        }
      });
  }, [data]);

  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<'submitted' | 'streaming' | 'ready' | 'error'>('ready');

  const sendMessage = async (message: { text: string }, options?: { body?: any }) => {
    if (!message.text.trim()) return;

    setStatus('submitted');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          messages: [{ role: 'user', content: message.text, parts: [{ type: 'text', text: message.text }] }],
          model: selectedModel,
          ...options?.body,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('streaming');
      // For now, just add the user message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        parts: [{ type: 'text', text: message.text }],
        createdAt: new Date(),
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    }
  };

  const stop = () => {
    setStatus('ready');
  };

  const regenerate = () => {
    // Simple regenerate - just clear last AI message if any
    setMessages(prev => prev.filter(msg => msg.role !== 'assistant').slice(0, -1));
  };

  useEffect(() => {
    if (data?.data?.model && !selectedModel) {
      setSelectedModel(data.data.model);
    }
  }, [data, selectedModel]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const handleSubmit = () => {
    if (!input.trim()) return;

    sendMessage(
      { text: input },
      {
        body: {
          model: selectedModel,
          chatId,
        },
      }
    );

    setInput("");
  };

  const handleRetry = () => {
    regenerate();
  };

  const handleStop = () => {
    stop();
  };

  const messageToRender = [...initialMessages, ...messages];

  console.log(messageToRender);

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className={"h-full"}>
          <ConversationContent>
            {messageToRender.length === 0 ? (
              <>
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start a conversation...
                </div>
              </>
            ) : (
              messageToRender.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part: any, i: number) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message
                            from={message.role}
                            key={`${message.id}-${i}`}
                          >
                            <MessageContent>
                              <div className="text-sm">{part.text}</div>
                            </MessageContent>
                          </Message>
                        );

                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))
            )}
            {status === "streaming" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className={"mt-4"}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            // disabled={status === "" }
            />
          </PromptInputBody>
          <div className="flex items-center justify-between">
            <PromptInputTools className={"flex items-center gap-2"}>
              {isModelLoading ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel || ""}
                  onModelSelect={setSelectedModel}
                />
              )}
              {status === "streaming" ? (
                <PromptInputButton onClick={handleStop}>
                  <StopCircleIcon size={16} />
                  <span>Stop</span>
                </PromptInputButton>
              ) : (
                messageToRender.length > 0 && (
                  <PromptInputButton onClick={handleRetry}>
                    <RotateCcwIcon size={16} />
                    <span>Retry</span>
                  </PromptInputButton>
                )
              )}
            </PromptInputTools>

            <PromptInputSubmit status={status} />
          </div>
        </PromptInput>
      </div>
    </div>
  );
};

export default MessageWithForm;
