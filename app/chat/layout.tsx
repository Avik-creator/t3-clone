import { currentUser } from "@/app/actions/user/index";
import ChatSidebar from "@/components/chat/chatSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth/utils";
import React from "react";
import { getAllChats } from "../actions/chat";

interface LayoutProps {
  children: React.ReactNode;
}

const layout = async ({ children }: LayoutProps) => {
  await requireAuth();
  const user = await currentUser();
  const { data: chats } = await getAllChats();

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <ChatSidebar user={user} chats={chats || []} />
        <main className="flex flex-1 flex-col overflow-hidden relative">
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 lg:h-[60px]">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold md:text-xl">T3 Chat</h1>
            </div>
          </header>
          <div className="flex-1 overflow-hidden">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default layout;
