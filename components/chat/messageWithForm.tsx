"use client";
import { useGetChatById } from "@/hooks/ai-agent";
import { useChat } from "@ai-sdk/react";
import { Fragment, useState, useEffect, useMemo, useRef } from "react";


import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse, MessageToolbar, MessageAction } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

import { Spinner } from "@/components/ui/spinner";
import { useAIModels } from "@/hooks/ai-agent";
import { useChatStore } from "@/store/chatStore";
import { useSearchParams, useRouter } from "next/navigation";

import { RotateCcwIcon, StopCircleIcon, CheckIcon } from "lucide-react";
import { DefaultChatTransport } from "ai";

const suggestions = [
  "What are the latest trends in AI?",
  "How does machine learning work?",
  "Explain quantum computing",
  "Best practices for React development",
  "Tell me about TypeScript benefits",
  "How to optimize database queries?",
  "What is the difference between SQL and NoSQL?",
  "Explain cloud computing basics",
];

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

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      { text: message.text || "" },
      {
        body: {
          model: selectedModel,
          chatId,
        },
      }
    );

    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(
      { text: suggestion },
      {
        body: {
          model: selectedModel,
          chatId,
        },
      }
    );
  };

  const handleRetry = (messageId?: string) => {
    if (messageId) {
      // Check if this message is from useChat's messages array (not initialMessages)
      const messageFromUseChat = messages.find(msg => msg.id === messageId);

      if (messageFromUseChat && messageFromUseChat.role === "assistant") {
        // Retry the specific assistant message from useChat
        regenerate({
          messageId,
          body: {
            model: selectedModel,
            chatId,
          }
        });
      } else {
        // If it's not a useChat message, regenerate the last assistant message from useChat
        const lastAssistantMessage = [...messages]
          .reverse()
          .find((msg) => msg.role === "assistant");

        if (lastAssistantMessage) {
          regenerate({
            messageId: lastAssistantMessage.id,
            body: {
              model: selectedModel,
              chatId,
            }
          });
        }
      }
    } else {
      // Fallback: Find the last assistant message from useChat to regenerate
      const lastAssistantMessage = [...messages]
        .reverse()
        .find((msg) => msg.role === "assistant");

      if (lastAssistantMessage) {
        regenerate({
          messageId: lastAssistantMessage.id,
          body: {
            model: selectedModel,
            chatId,
          }
        });
      }
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
      isFromUseChat: false, // Mark as not from useChat
    })),
    ...messages.map(msg => ({
      ...msg,
      isFromUseChat: true, // Mark as from useChat
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-6 relative size-full min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)]">
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
                              {message.role === "assistant" && message.isFromUseChat && (
                                <MessageToolbar>
                                  <MessageAction
                                    onClick={() => handleRetry(message.id)}
                                    tooltip="Retry this response"
                                  >
                                    <RotateCcwIcon size={14} />
                                  </MessageAction>
                                </MessageToolbar>
                              )}
                            </Message>
                          );

                        case "reasoning":
                          return (
                            <Reasoning
                              className="max-w-full sm:max-w-2xl px-3 py-3 sm:px-4 sm:py-4 border border-muted rounded-md bg-muted/50"
                              key={`${message.id}-${i}`}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
                                {part.text}
                              </ReasoningContent>
                            </Reasoning>
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
                      {message.role === "assistant" && message.isFromUseChat && (
                        <MessageToolbar>
                          <MessageAction
                            onClick={() => handleRetry(message.id)}
                            tooltip="Retry this response"
                          >
                            <RotateCcwIcon size={14} />
                          </MessageAction>
                        </MessageToolbar>
                      )}
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

        <div className="grid shrink-0 gap-4 pt-4">
          <Suggestions className="px-4">
            {suggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                suggestion={suggestion}
              />
            ))}
          </Suggestions>
          <div className="w-full px-4 pb-4">
            <PromptInput globalDrop multiple onSubmit={handleSubmit}>
              <PromptInputHeader>
                <PromptInputAttachments>
                  {(attachment) => <PromptInputAttachment data={attachment} />}
                </PromptInputAttachments>
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(event) => setInput(event.target.value)}
                  value={input}
                  placeholder="Type your message..."
                />
              </PromptInputBody>
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                  {isModelLoading ? (
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Spinner className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Loading models...</span>
                    </div>
                  ) : (
                    <ModelSelector>
                      <ModelSelectorTrigger asChild>
                        <PromptInputButton>
                          {(() => {
                            const selectedModelData = models?.models?.find((m: any) => m.id === selectedModel);
                            const provider = selectedModelData?.id?.split('/')[0] || 'unknown';
                            return (
                              <>
                                {provider && provider !== 'unknown' && (
                                  <ModelSelectorLogo provider={provider} />
                                )}
                                {selectedModelData?.name && (
                                  <ModelSelectorName className="truncate">
                                    {selectedModelData.name}
                                  </ModelSelectorName>
                                )}
                              </>
                            );
                          })()}
                        </PromptInputButton>
                      </ModelSelectorTrigger>
                      <ModelSelectorContent>
                        <ModelSelectorInput placeholder="Search models..." />
                        <ModelSelectorList>
                          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                          {models?.models &&
                            Object.entries(
                              models.models.reduce((groups: Record<string, any[]>, model: any) => {
                                const provider = model.id?.split('/')[0] || 'unknown';
                                if (!groups[provider]) {
                                  groups[provider] = [];
                                }
                                groups[provider].push(model);
                                return groups;
                              }, {} as Record<string, any[]>)
                            ).filter(([provider]) => provider !== 'unknown')
                              .map(([provider, providerModels]) => (
                                <ModelSelectorGroup key={provider} heading={provider}>
                                  {(providerModels as any[]).map((model: any) => (
                                    <ModelSelectorItem
                                      key={model.id}
                                      onSelect={() => setSelectedModel(model.id)}
                                      value={model.id}
                                    >
                                      <ModelSelectorLogo provider={provider} />
                                      <ModelSelectorName className="truncate">
                                        {model.name}
                                      </ModelSelectorName>
                                      {selectedModel === model.id ? (
                                        <CheckIcon className="ml-auto size-4 shrink-0" />
                                      ) : (
                                        <div className="ml-auto size-4" />
                                      )}
                                    </ModelSelectorItem>
                                  ))}
                                </ModelSelectorGroup>
                              ))}
                        </ModelSelectorList>
                      </ModelSelectorContent>
                    </ModelSelector>
                  )}
                  {status === "streaming" && (
                    <PromptInputButton onClick={handleStop}>
                      <StopCircleIcon size={16} />
                      <span className="sr-only">Stop</span>
                    </PromptInputButton>
                  )}
                </PromptInputTools>
                <PromptInputSubmit
                  disabled={!(input.trim() || status) || status === "streaming"}
                  status={status}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageWithForm;
