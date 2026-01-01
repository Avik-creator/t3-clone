"use client";
import React from 'react';
import { useChatStore } from '@/store/chatStore';
import ChatMessageForm from './chatMessageForm';
import ChatMessageView from './chatMessageView';

interface MessageWithFormProps {
  chatId: string;
}

const MessageWithForm = ({ chatId }: MessageWithFormProps) => {
  const { messages } = useChatStore();

  return (
    <ChatMessageView messages={messages} />
  );
};

export default MessageWithForm;
