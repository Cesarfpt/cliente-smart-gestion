
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { BotResponseFormValues } from '@/components/Chat/ResponseForm';

export interface BotResponse {
  id: string;
  keyword: string;
  response: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

export const useBotResponses = () => {
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchResponses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Primero obtenemos el company_id del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;
      
      if (userData?.company_id) {
        const { data, error } = await supabase
          .from('bot_responses')
          .select('*')
          .eq('company_id', userData.company_id)
          .order('priority', { ascending: false });
          
        if (error) throw error;
        
        setResponses(data || []);
      }
    } catch (error) {
      console.error('Error fetching bot responses:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las respuestas predefinidas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchResponses();
    }
  }, [user]);

  const handleDeleteResponse = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('bot_responses')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setResponses(responses.filter(response => response.id !== id));
      
      toast({
        title: 'Respuesta eliminada',
        description: 'La respuesta predefinida ha sido eliminada correctamente.',
      });
    } catch (error) {
      console.error('Error deleting bot response:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la respuesta predefinida.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveResponse = async (data: BotResponseFormValues, editingResponseId: string | null = null) => {
    if (!user) return;
    
    try {
      // Primero obtenemos el company_id del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single();
        
      if (userError) throw userError;
      
      if (!userData?.company_id) {
        toast({
          title: 'Error',
          description: 'No se pudo asociar la respuesta a una empresa.',
          variant: 'destructive',
        });
        return;
      }
      
      if (editingResponseId) {
        // Actualizar respuesta existente
        const { error } = await supabase
          .from('bot_responses')
          .update({
            keyword: data.keyword,
            response: data.response,
            priority: data.priority,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingResponseId);
          
        if (error) throw error;
        
        toast({
          title: 'Respuesta actualizada',
          description: 'La respuesta predefinida ha sido actualizada correctamente.',
        });
      } else {
        // Crear nueva respuesta
        const { error } = await supabase
          .from('bot_responses')
          .insert({
            company_id: userData.company_id,
            keyword: data.keyword,
            response: data.response,
            priority: data.priority,
          });
          
        if (error) throw error;
        
        toast({
          title: 'Respuesta creada',
          description: 'La nueva respuesta predefinida ha sido creada correctamente.',
        });
      }
      
      fetchResponses();
    } catch (error) {
      console.error('Error saving bot response:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar la respuesta predefinida.',
        variant: 'destructive',
      });
    }
  };

  return {
    responses,
    loading,
    fetchResponses,
    handleDeleteResponse,
    handleSaveResponse
  };
};
