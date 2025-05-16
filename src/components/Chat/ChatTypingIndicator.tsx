
import React from 'react';

export const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-muted text-muted-foreground max-w-[75%] rounded-lg p-3">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-100"></div>
          <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};
