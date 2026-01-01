import ActiveChatLoader from '@/components/chat/activeChatLoader';
import MessageWithForm from '@/components/chat/messageWithForm';

const Page = async ({ params }: { params: { chatId: string } }) => {
  const { chatId } = await params;
  return (
    <>
      <ActiveChatLoader chatId={chatId} />
      <MessageWithForm chatId={chatId} />
    </>
  )
}

export default Page