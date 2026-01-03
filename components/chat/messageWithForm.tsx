"use client";
import { useGetChatById } from "@/hooks/ai-agent";
import { useChat } from "@ai-sdk/react";
import { Fragment, useState, useEffect, useMemo, useRef } from "react";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "@/components/chat/modelSelector";
import { useAIModels } from "@/hooks/ai-agent";
import { useChatStore } from "@/store/chatStore";
import { useSearchParams, useRouter } from "next/navigation";
import { RotateCcwIcon, StopCircleIcon } from "lucide-react";
import { DefaultChatTransport } from "ai";

interface MessageWithFormProps {
  chatId: string;
}

interface MessagePart {
  type: string;
  text?: string;
}

interface ParsedMessage {
  id: string;
  role: string;
  parts: MessagePart[];
  createdAt: Date;
}

const MessageWithForm = ({ chatId }: MessageWithFormProps) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);
  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();

  // Derive default model from data
  const defaultModel = useMemo(() => data?.data?.model ?? "", [data]);

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [input, setInput] = useState("");

  // Use derived model if no selection made
  const activeModel = selectedModel || defaultModel;

  const hasAutoTriggered = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";

  const initialMessages = useMemo<ParsedMessage[]>(() => {
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
        } catch {
          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: [{ type: "text", text: msg.content }],
            createdAt: msg.createdAt,
          };
        }
      });
  }, [data]);

  const { stop, messages, status, sendMessage, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
  });

  useEffect(() => {
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!activeModel) return;
    if (initialMessages.length === 0) return;

    const lastMessage = initialMessages[initialMessages.length - 1];
    if (lastMessage.role !== "user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId);

    // Use sendMessage with skipUserMessage instead of regenerate
    // since useChat doesn't have the initial messages loaded
    sendMessage(
      { text: "" },
      {
        body: {
          model: activeModel,
          chatId,
          skipUserMessage: true,
        },
      }
    );

    router.replace(`/chat/${chatId}`, { scroll: false });
  }, [
    shouldAutoTrigger,
    chatId,
    activeModel,
    initialMessages,
    markChatAsTriggered,
    hasChatBeenTriggered,
    sendMessage,
    router,
  ]);

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
          model: activeModel,
          chatId,
        },
      }
    );
    setInput("");
  };

  const handleRetry = (messageId?: string) => {
    // Only regenerate if there are messages in useChat state
    if (messages.length > 0 && messageId) {
      regenerate({
        messageId,
        body: {
          model: activeModel,
          chatId,
        },
      });
    } else {
      // If no messages in useChat, send empty message to trigger AI response
      sendMessage(
        { text: "" },
        {
          body: {
            model: activeModel,
            chatId,
            skipUserMessage: true,
          },
        }
      );
    }
  };

  const handleStop = () => {
    stop();
  };

  // Combine initial messages with streaming messages, filtering out duplicates and empty messages
  const initialMessageIds = new Set(initialMessages.map((m) => m.id));
  const messageToRender = [
    ...initialMessages.map((msg) => ({ ...msg, isFromUseChat: false })),
    ...messages
      .filter((msg) => !initialMessageIds.has(msg.id)) // Filter out duplicates
      .filter((msg) => {
        // Filter out empty messages (from skipUserMessage)
        const textPart = msg.parts?.find((p) => p.type === "text");
        const hasText = textPart && "text" in textPart && textPart.text?.trim();
        return hasText || msg.role === "assistant";
      })
      .map((msg) => {
        // Extract text from parts if available
        const textPart = msg.parts?.find((p) => p.type === "text");
        const textContent = textPart && "text" in textPart ? textPart.text : "";
        return {
          id: msg.id,
          role: msg.role,
          parts: msg.parts || [{ type: "text", text: textContent }],
          createdAt: new Date(),
          isFromUseChat: true,
        };
      }),
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messageToRender.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Start a conversation...
              </div>
            ) : (
              messageToRender.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <Message
                            from={
                              message.role as "user" | "assistant" | "system"
                            }
                            key={`${message.id}-${i}`}
                          >
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                            {message.role === "assistant" && (
                              <MessageActions className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <MessageAction
                                  onClick={() => handleRetry(message.id)}
                                  tooltip="Regenerate"
                                >
                                  <RotateCcwIcon size={12} />
                                </MessageAction>
                              </MessageActions>
                            )}
                          </Message>
                        );
                      case "reasoning":
                        return (
                          <Reasoning
                            className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
                            key={`${message.id}-${i}`}
                            isStreaming={status === "streaming"}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
                              {part.text || ""}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools className="flex items-center gap-2">
              {isModelLoading ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={activeModel}
                  onModelSelect={setSelectedModel}
                />
              )}
              {status === "streaming" && (
                <PromptInputButton onClick={handleStop}>
                  <StopCircleIcon size={16} />
                  <span>Stop</span>
                </PromptInputButton>
              )}
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default MessageWithForm;
