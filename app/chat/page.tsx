import { currentUser } from "@/app/actions/user/index";
import ChatMessageView from "@/components/chat/chatMessageView";

export default async function ChatPage() {
  const user = await currentUser();

  return <ChatMessageView user={user} />;
}
