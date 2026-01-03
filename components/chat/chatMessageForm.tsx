"use client";

import { useState, useMemo } from "react";
import { useAIModels } from "@/hooks/ai-agent";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "@/components/chat/modelSelector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage } from "@/app/actions/chat";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

interface ChatMessageFormProps {
  initialMessage: string;
  onMessageChange: () => void;
}

const ChatMessageForm = ({
  initialMessage,
  onMessageChange,
}: ChatMessageFormProps) => {
  const { data: models, isPending: isModelLoading } = useAIModels();

  // Derive default model from data
  const defaultModel = useMemo(() => models?.models?.[0]?.id ?? "", [models]);

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [localMessage, setLocalMessage] = useState("");

  // Compute the actual message to display
  const message = initialMessage || localMessage;

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: { content: string; model: string }) =>
      createChatWithMessage(values),
    onSuccess: (res) => {
      if (res.success && res.data) {
        const chat = res.data;
        queryClient.invalidateQueries({ queryKey: ["chats"] });
        router.push(`/chat/${chat.id}?autoTrigger=true`);
      }
    },
    onError: (error) => {
      console.error("Create chat error:", error);
      toast.error("Failed to create chat");
    },
  });

  // Use derived model if no selection made
  const activeModel = selectedModel || defaultModel;

  const handleMessageChange = (value: string) => {
    if (initialMessage) {
      onMessageChange();
    }
    setLocalMessage(value);
  };

  const handleSubmit = () => {
    if (!message.trim() || !activeModel) return;

    mutation.mutate({ content: message, model: activeModel });
    setLocalMessage("");
    if (initialMessage) {
      onMessageChange();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
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
          </PromptInputTools>
          <PromptInputSubmit disabled={!message.trim() || mutation.isPending} />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default ChatMessageForm;
