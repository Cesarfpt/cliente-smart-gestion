
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ChatMessage } from './ChatMessage';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { useBotConfig } from '@/hooks/useBotConfig';

interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  timestamp: Date;
}

// Define interfaces que corresponden a nuestras tablas de Supabase
interface MessageHistoryRow {
  id: string;
  customer_id: string;
  company_id: string | null;
  message_content: string;
  message_type: 'user' | 'bot';
  message_timestamp: string;
  is_processed: boolean | null;
  response_delay_ms: number | null;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { botConfig } = useBotConfig();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Si es la primera vez y no hay mensajes, mostrar mensaje de bienvenida
  useEffect(() => {
    if (user && messages.length === 0 && !isLoading && botConfig) {
      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        content: botConfig.greeting_message || '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
        is_bot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user, messages.length, isLoading, botConfig]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('message_history')
        .select('*')
        .eq('customer_id', user?.id)
        .order('message_timestamp', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedMessages: Message[] = data.map((msg: MessageHistoryRow) => ({
          id: msg.id,
          content: msg.message_content,
          is_bot: msg.message_type === 'bot',
          timestamp: new Date(msg.message_timestamp)
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los mensajes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      is_bot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Guardar mensaje del usuario
      const { error: userMsgError } = await supabase
        .from('message_history')
        .insert({
          customer_id: user.id,
          message_content: newMessage,
          message_type: 'user',
          company_id: user.id ? (await supabase.from('users').select('company_id').eq('id', user.id).single()).data?.company_id : null
        });
      
      if (userMsgError) throw userMsgError;
      
      // Buscar respuesta predefinida
      const { data: responseData } = await supabase
        .from('bot_responses')
        .select('*')
        .or(`keyword.ilike.%${newMessage.trim().toLowerCase()}%`)
        .order('priority', { ascending: false })
        .limit(1);
      
      // Simular respuesta del bot (aquí se integraría con un servicio de AI real)
      setTimeout(async () => {
        let botResponse: string;
        let responseDelay = 1000; // Delay por defecto
        
        // Si encontramos una respuesta predefinida, usarla
        if (responseData && responseData.length > 0) {
          botResponse = responseData[0].response;
        } else {
          botResponse = "¡Gracias por tu mensaje! Soy el asistente virtual, en este momento estoy en desarrollo, pronto podré ayudarte con tus consultas.";
        }
        
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          content: botResponse,
          is_bot: true,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Guardar respuesta del bot
        const { error: botMsgError } = await supabase
          .from('message_history')
          .insert({
            customer_id: user.id,
            message_content: botResponse,
            message_type: 'bot',
            company_id: user.id ? (await supabase.from('users').select('company_id').eq('id', user.id).single()).data?.company_id : null,
            is_processed: true,
            response_delay_ms: responseDelay
          });
          
        if (botMsgError) throw botMsgError;
        
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-500">Inicia sesión para usar el chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] border rounded-lg overflow-hidden bg-card">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <h2 className="text-xl font-bold">{botConfig?.bot_name || "Asistente Virtual"}</h2>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Inicia una conversación...</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isLoading && <ChatTypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-background">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};
