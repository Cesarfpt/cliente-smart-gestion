
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface BotConfig {
  id: string;
  bot_name: string;
  greeting_message: string;
  farewell_message: string;
  company_id: string | null;
}

export const useBotConfig = () => {
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBotConfig = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Primero obtenemos el company_id del usuario
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('company_id')
          .eq('id', user.id)
          .single();
          
        if (userError) throw userError;
        
        if (userData?.company_id) {
          // Ahora buscamos la configuración para esta empresa
          const { data: configData, error: configError } = await supabase
            .from('bot_config')
            .select('*')
            .eq('company_id', userData.company_id)
            .single();
            
          if (configError && configError.code !== 'PGRST116') { // PGRST116 es "no se encontraron resultados"
            throw configError;
          }
          
          if (configData) {
            setBotConfig(configData);
          } else {
            // Si no hay configuración, creamos una por defecto
            const { data: newConfig, error: insertError } = await supabase
              .from('bot_config')
              .insert({
                company_id: userData.company_id,
                bot_name: 'Asistente Virtual',
                greeting_message: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?',
                farewell_message: 'Gracias por tu consulta. ¡Hasta pronto!'
              })
              .select()
              .single();
              
            if (insertError) throw insertError;
            
            if (newConfig) {
              setBotConfig(newConfig);
            }
          }
        }
      } catch (err: any) {
        console.error('Error fetching bot config:', err);
        setError(err.message || 'Error al cargar la configuración del bot');
      } finally {
        setLoading(false);
      }
    };

    fetchBotConfig();
  }, [user]);

  return { botConfig, loading, error };
};
