
import React from 'react';
import { ChatInterface } from '@/components/Chat/ChatInterface';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const ChatBot = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Chat con Asistente Virtual</h1>
        <ChatInterface />
      </div>
    </ProtectedRoute>
  );
};

export default ChatBot;
