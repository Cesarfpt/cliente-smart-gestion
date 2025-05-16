
import React from 'react';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  botName: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ botName }) => {
  return (
    <div className="bg-primary text-primary-foreground p-4">
      <div className="flex items-center space-x-2">
        <Bot className="h-6 w-6" />
        <h2 className="text-xl font-bold">{botName}</h2>
      </div>
    </div>
  );
};
