
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { useBotConfig } from '@/hooks/useBotConfig';

export interface Message {
  id: string;
  content: string;
  is_bot: boolean;
  timestamp: Date;
}

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

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { botConfig } = useBotConfig();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

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

  const sendMessage = async (content: string) => {
    if (!content.trim() || !user) return;
    
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      is_bot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Guardar mensaje del usuario
      const { error: userMsgError } = await supabase
        .from('message_history')
        .insert({
          customer_id: user.id,
          message_content: content,
          message_type: 'user',
          company_id: user.id ? (await supabase.from('users').select('company_id').eq('id', user.id).single()).data?.company_id : null
        });
      
      if (userMsgError) throw userMsgError;
      
      // Buscar respuesta predefinida
      const { data: responseData } = await supabase
        .from('bot_responses')
        .select('*')
        .or(`keyword.ilike.%${content.trim().toLowerCase()}%`)
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

  return {
    messages,
    isLoading,
    sendMessage
  };
};
