import { useQuery } from "@tanstack/react-query";
import { getChatById } from "@/app/actions/chat";

export const useAIModels = () => {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: () => fetch("/api/ai/get-models").then(res => res.json()),
  })
}

export const useGetChatById = (chatId: string) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });
}   