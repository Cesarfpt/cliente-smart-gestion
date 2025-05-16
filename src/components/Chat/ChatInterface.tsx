
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBotConfig } from '@/hooks/useBotConfig';
import { useChatMessages } from '@/hooks/useChatMessages';
import { ChatHeader } from './ChatHeader';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputForm } from './ChatInputForm';

export const ChatInterface = () => {
  const { user } = useAuth();
  const { botConfig } = useBotConfig();
  const { messages, isLoading, sendMessage } = useChatMessages();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Inicia sesión para usar el chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] border rounded-lg overflow-hidden bg-card">
      <ChatHeader botName={botConfig?.bot_name || "Asistente Virtual"} />
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInputForm onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};
