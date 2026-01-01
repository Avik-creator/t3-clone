import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  activeChatId: null,

  setActiveChatId: (chatId: string | null) => set({ activeChatId: chatId })
}))