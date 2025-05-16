
import React from 'react';

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div
      className={`flex ${message.is_bot ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[75%] rounded-lg p-3 ${
          message.is_bot
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        <p>{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
