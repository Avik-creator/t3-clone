import { create } from "zustand";
import { Chat, Message } from "@/lib/generated/prisma/client";

interface ChatStoreState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  triggeredChats: Set<string>;
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  markChatAsTriggered: (chatId: string) => void;
  hasChatBeenTriggered: (chatId: string) => boolean;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  triggeredChats: new Set(),

  setChats: (chats) => set({ chats }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  setMessages: (messages) => set({ messages }),

  // ➕ Add new chat (on create)
  addChat: (chat) => set({ chats: [chat, ...get().chats] }),

  // 💬 Append a new message (user or assistant)
  addMessage: (message) => set({ messages: [...get().messages, message] }),

  // 🧹 Clear messages when switching chat
  clearMessages: () => set({ messages: [] }),

  markChatAsTriggered: (chatId) => {
    const triggered = new Set(get().triggeredChats);
    triggered.add(chatId);
    set({ triggeredChats: triggered });
  },

  hasChatBeenTriggered: (chatId) => {
    return get().triggeredChats.has(chatId);
  },
}));