
import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ChatStats } from '@/components/Chat/ChatStats';
import { useChatStats } from '@/hooks/useChatStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ChatStatsPage = () => {
  const { 
    totalMessages,
    userMessages, 
    botMessages, 
    averageResponseTime, 
    mostCommonKeywords,
    isLoading 
  } = useChatStats();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Estadísticas del Chat</h1>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Cargando estadísticas...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p>Obteniendo datos del chat...</p>
              </div>
            </CardContent>
          </Card>
        ) : totalMessages === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No hay datos disponibles</CardTitle>
              <CardDescription>
                No se encontraron mensajes en el historial de chat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Comienza a chatear con el asistente virtual para generar estadísticas.</p>
            </CardContent>
          </Card>
        ) : (
          <ChatStats 
            totalMessages={totalMessages}
            userMessages={userMessages}
            botMessages={botMessages}
            averageResponseTime={averageResponseTime}
            mostCommonKeywords={mostCommonKeywords}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ChatStatsPage;
