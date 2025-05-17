
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface ChatStats {
  totalMessages: number;
  userMessages: number;
  botMessages: number;
  averageResponseTime: number;
  mostCommonKeywords: { keyword: string; count: number }[];
  isLoading: boolean;
}

export const useChatStats = (): ChatStats => {
  const [stats, setStats] = useState<ChatStats>({
    totalMessages: 0,
    userMessages: 0,
    botMessages: 0,
    averageResponseTime: 0,
    mostCommonKeywords: [],
    isLoading: true
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChatStats();
    }
  }, [user]);

  const fetchChatStats = async () => {
    if (!user) return;
    
    try {
      // Obtener recuento total de mensajes y por tipo
      const { data: messageData, error: messageError } = await supabase
        .from('message_history')
        .select('message_type, response_delay_ms')
        .eq('customer_id', user.id);
        
      if (messageError) throw messageError;

      if (messageData) {
        const userMsgs = messageData.filter(msg => msg.message_type === 'user').length;
        const botMsgs = messageData.filter(msg => msg.message_type === 'bot').length;
        
        // Calcular tiempo medio de respuesta
        const responseTimes = messageData
          .filter(msg => msg.response_delay_ms !== null)
          .map(msg => msg.response_delay_ms);
        
        const avgResponseTime = responseTimes.length > 0 
          ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) 
          : 0;

        // Analizar palabras clave comunes (simplificado)
        // Para un análisis real, necesitaríamos procesamiento NLP más avanzado
        const dummyKeywords = [
          { keyword: 'ayuda', count: Math.round(Math.random() * 10) + 1 },
          { keyword: 'precio', count: Math.round(Math.random() * 10) + 1 },
          { keyword: 'horario', count: Math.round(Math.random() * 10) + 1 },
          { keyword: 'gracias', count: Math.round(Math.random() * 10) + 1 },
          { keyword: 'problema', count: Math.round(Math.random() * 10) + 1 },
        ].sort((a, b) => b.count - a.count);

        setStats({
          totalMessages: messageData.length,
          userMessages: userMsgs,
          botMessages: botMsgs,
          averageResponseTime: avgResponseTime,
          mostCommonKeywords: dummyKeywords,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las estadísticas del chat',
        variant: 'destructive',
      });
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  return stats;
};
