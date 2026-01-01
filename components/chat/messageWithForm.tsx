"use client";
import { useGetChatById } from "@/hooks/ai-agent";
import { useChat } from "@ai-sdk/react";
import { Fragment, useState, useEffect, useMemo, useRef } from "react";


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
import { MessageResponse } from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

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

const MessageWithForm = ({ chatId }: MessageWithFormProps) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending, isLoading } = useGetChatById(chatId);
  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();

  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");


  const hasAutoTriggered = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";




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


  const { stop, messages, status, sendMessage, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: {
        chatId,
      },
    }),
  });


  useEffect(() => {
    if (data?.data?.model && !selectedModel) {
      setSelectedModel(data.data.model)
    }
  }, [data, selectedModel])


  useEffect(() => {
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!selectedModel) return;
    if (isPending || !data) return;
    if (initialMessages.length === 0) return;

    const lastMessage = initialMessages[initialMessages.length - 1];
    if (lastMessage.role !== "user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId)

    // For auto-trigger, use regenerate to get AI response to existing conversation
    regenerate();

    router.replace(`/chat/${chatId}`, { scroll: false })
  }, [
    shouldAutoTrigger,
    chatId,
    selectedModel,
    initialMessages,
    data,
    isPending,
    markChatAsTriggered,
    hasChatBeenTriggered,
    regenerate,
    router,
  ])


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
    // Find the last assistant message to regenerate
    const lastAssistantMessage = [...messageToRender]
      .reverse()
      .find((msg) => msg.role === "assistant");

    if (lastAssistantMessage) {
      regenerate({ messageId: lastAssistantMessage.id });
    }
  };

  const handleStop = () => {
    stop();
  };

  // Combine initial messages (from DB) with new messages (from useChat)
  const messageToRender = [
    ...initialMessages.map(msg => ({
      ...msg,
      id: msg.id || `initial-${Date.now()}-${Math.random()}`, // Ensure unique ID
    })),
    ...messages
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className={"h-full"}>
          <ConversationContent>
            {messageToRender.length === 0 ? (
              <>
                <div className="flex items-center justify-center h-full text-gray-500">
                  Start a coversation...
                </div>
              </>
            ) : (
              messageToRender.map((message: any) => (
                <Fragment key={message.id}>
                  {/* Handle messages with parts array (from DB) */}
                  {message.parts ? (
                    message.parts.map((part: any, i: number) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Message
                              from={message.role as "user" | "system" | "assistant"}
                              key={`${message.id}-${i}`}
                            >
                              <MessageContent>
                                <MessageResponse>{part.text}</MessageResponse>
                              </MessageContent>
                            </Message>
                          );

                        case "reasoning":
                          return (
                            <div key={`${message.id}-${i}`}>
                              <Reasoning>
                                <ReasoningTrigger />
                                <ReasoningContent>{part.text}</ReasoningContent>
                              </Reasoning>
                            </div>
                          );
                      }
                    })
                  ) : (
                    /* Handle messages with content property (from useChat) */
                    <Message
                      from={message.role as "user" | "system" | "assistant"}
                      key={message.id}
                    >
                      <MessageContent>
                        <MessageResponse>{message.content}</MessageResponse>
                      </MessageContent>
                    </Message>
                  )}
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
                messages.length > 0 && (
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
