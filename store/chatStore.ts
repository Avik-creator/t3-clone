import { create } from "zustand";
import { Chat, Message } from "@/lib/generated/prisma/client";

interface ChatStoreState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],

  setChats: (chats: Chat[]) => set({ chats }),
  setActiveChatId: (chatId: string | null) => set({ activeChatId: chatId }),
  setMessages: (messages: Message[]) => set({ messages }),

  // ➕ Add new chat (on create)
  addChat: (chat: Chat) => set({ chats: [chat, ...get().chats] }),

  // 💬 Append a new message (user or assistant)
  addMessage: (message: Message) => set({ messages: [...get().messages, message] }),

  // 🧹 Clear messages when switching chat
  clearMessages: () => set({ messages: [] }),
}));