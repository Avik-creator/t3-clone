import { currentUser } from "@/app/actions/user/index";
import ChatSidebar from "@/components/chat/chatSidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
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
      <ChatSidebar user={user} chats={chats || []} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 lg:h-[60px]">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold md:text-xl">T3 Chat</h1>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
