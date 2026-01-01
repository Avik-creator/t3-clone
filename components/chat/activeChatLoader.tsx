"use client";
import { useQuery } from "@tanstack/react-query";
import { getChatById } from "@/app/actions/chat";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";

interface ActiveChatLoaderProps {
  chatId: string;
}

const ActiveChatLoader = ({ chatId }: ActiveChatLoaderProps) => {
  const { setActiveChatId, setMessages, addChat, chats } = useChatStore();

  const { data } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  useEffect(() => {
    if (!chatId) return;
    setActiveChatId(chatId);
  }, [chatId, setActiveChatId]);

  useEffect(() => {
    if (!data || !data.success || !data.data) return;

    const chat = data.data;

    // populate messages
    setMessages(chat.messages || []);

    if (!chats?.some((c) => c.id === chat.id)) {
      addChat(chat);
    }
  }, [data, setMessages, addChat, chats]);

  return null;
};

export default ActiveChatLoader;
