"use client";
import { useState, useMemo, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserButton from "@/components/Auth/components/userButton";
import { cn } from "@/lib/utils";
import { PlusIcon, SearchIcon, EllipsisIcon, Trash } from "lucide-react";
import DeleteChatModal from "./modal/chat-delete-modal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages?: Array<{ content: string }>;
}

interface ChatSidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt?: Date | string;
  };
  chats: Chat[];
}

const ChatSidebar = ({ user, chats }: ChatSidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }

    const query = searchQuery.toLowerCase();

    return chats.filter((chat) =>
      chat.title?.toLowerCase().includes(query) ||
      chat.messages?.some((msg) =>
        msg.content?.toLowerCase().includes(query)
      )
    );
  }, [chats, searchQuery]);

  const groupedChats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [] as Chat[],
      yesterday: [] as Chat[],
      lastWeek: [] as Chat[],
      older: [] as Chat[],
    };

    filteredChats.forEach((chat) => {
      const chatDate = new Date(chat.createdAt);

      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const onDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsModalOpen(true);
  };

  const renderChatList = (chatList: Chat[]) => {
    if (chatList.length === 0) return null;

    return (
      <SidebarMenu>
        {chatList.map((chat) => (
          <SidebarMenuItem key={chat.id}>
            <SidebarMenuButton asChild>
              <Link href={`/chat/${chat.id}`} className="flex items-center justify-between w-full">
                <span className="truncate flex-1">{chat.title}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10"
                      onClick={(e) => e.preventDefault()}
                    >
                      <EllipsisIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex flex-row gap-2 cursor-pointer text-destructive focus:text-destructive"
                      onClick={(e) => onDelete(e, chat.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-3 py-3">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <span className="font-bold text-sidebar-foreground">T3 Chat</span>
          </div>

          <div className="px-3 pb-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your chats..."
                className="pl-9 bg-sidebar-accent border-none"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {filteredChats.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {searchQuery ? "No chats found" : "No chats yet"}
            </div>
          ) : (
            <>
              {groupedChats.today.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                      Today
                    </div>
                    {renderChatList(groupedChats.today)}
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {groupedChats.yesterday.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                      Yesterday
                    </div>
                    {renderChatList(groupedChats.yesterday)}
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {groupedChats.lastWeek.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                      Last 7 Days
                    </div>
                    {renderChatList(groupedChats.lastWeek)}
                  </SidebarGroupContent>
                </SidebarGroup>
              )}

              {groupedChats.older.length > 0 && (
                <SidebarGroup>
                  <SidebarGroupContent>
                    <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                      Older
                    </div>
                    {renderChatList(groupedChats.older)}
                  </SidebarGroupContent>
                </SidebarGroup>
              )}
            </>
          )}
        </SidebarContent>

        <SidebarFooter>
          <div className="px-3 py-3">
            <Link href="/chat" className="block">
              <Button className="w-full rounded-md">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </Link>
          </div>

          <div className="px-3 py-3 flex items-center gap-3">
            <UserButton user={user} />
            <span className="flex-1 text-sm text-sidebar-foreground truncate">
              {user.email}
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <DeleteChatModal
        chatId={selectedChatId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default ChatSidebar;
