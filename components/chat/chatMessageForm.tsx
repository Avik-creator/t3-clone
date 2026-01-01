"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIModels } from "@/hooks/ai-agent";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "@/components/chat/modelSelector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage } from "@/app/actions/chat";
import { toast } from "sonner";

interface ChatMessageFormProps {
  initialMessage: string;
  onMessageChange: (message: string) => void;
}

const ChatMessageForm = ({ initialMessage, onMessageChange }: ChatMessageFormProps) => {
  const { data: models, isPending } = useAIModels();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (values: { content: string; model: string }) => createChatWithMessage(values),
    onSuccess: (res) => {
      if (res.success && res.data) {
        const chat = res.data;
        queryClient.invalidateQueries({ queryKey: ['chats'] });
        router.push(`/chat/${chat.id}?autoTrigger=true`);
      }
    },
    onError: (error) => {
      console.error("Create chat error:", error);
      toast.error("Failed to create chat");
    }
  });

  useEffect(() => {
    if (models?.models && models.models.length > 0 && !selectedModel) {
      setSelectedModel(models.models[0].id);
    }
  }, [models, selectedModel]);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !selectedModel) return;

    try {
      await mutation.mutateAsync({ content: message, model: selectedModel });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form onSubmit={handleSubmit}>
        <div
          className="relative rounded-2xl border-border shadow-sm transition-all
            "
        >
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your mesage here..."
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0 "
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (message.trim() && selectedModel && !mutation.isPending) {
                  mutation.mutate({ content: message, model: selectedModel });
                  setMessage("");
                }
              }
            }}
          />

          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t">
            {/* Model Selector */}
            <div className="flex items-center gap-1">
              {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>

                  <ModelSelector
                    models={models?.models}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel}
                    className="ml-1"
                  />
                </>
              )}
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || mutation.isPending}
              size="sm"
              variant={message.trim() ? "default" : "ghost"}
              className="h-8 w-8 p-0 rounded-full"
            >
              {mutation.isPending ? (
                <Spinner />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageForm;