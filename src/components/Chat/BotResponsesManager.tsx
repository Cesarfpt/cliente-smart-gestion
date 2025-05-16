
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface BotResponse {
  id: string;
  keyword: string;
  response: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'La palabra clave debe tener al menos 2 caracteres.' }),
  response: z.string().min(10, { message: 'La respuesta debe tener al menos 10 caracteres.' }),
  priority: z.number().int().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

export const BotResponsesManager = () => {
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<BotResponse | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keyword: '',
      response: '',
      priority: 0,
    },
  });

  useEffect(() => {
    if (user) {
      fetchResponses();
    }
  }, [user]);

  useEffect(() => {
    if (editingResponse) {
      form.reset({
        keyword: editingResponse.keyword,
        response: editingResponse.response,
        priority: editingResponse.priority,
      });
    } else {
      form.reset({
        keyword: '',
        response: '',
        priority: 0,
      });
    }
  }, [editingResponse, form]);

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

  const openAddDialog = () => {
    setEditingResponse(null);
    setDialogOpen(true);
  };

  const openEditDialog = (response: BotResponse) => {
    setEditingResponse(response);
    setDialogOpen(true);
  };

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

  const onSubmit = async (data: FormValues) => {
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
      
      if (editingResponse) {
        // Actualizar respuesta existente
        const { error } = await supabase
          .from('bot_responses')
          .update({
            keyword: data.keyword,
            response: data.response,
            priority: data.priority,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingResponse.id);
          
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
      
      setDialogOpen(false);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuestas Predefinidas</CardTitle>
        <CardDescription>
          Configura respuestas automáticas basadas en palabras clave.
          <Button variant="outline" size="sm" className="mt-2" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-1" />
            Nueva Respuesta
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center p-4">Cargando respuestas...</div>
        ) : responses.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            No hay respuestas predefinidas. Crea una para que tu bot pueda responder automáticamente.
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <div key={response.id} className="border rounded-md p-4 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Palabra clave:</span>
                    <span className="bg-muted px-2 py-1 rounded-md text-sm">{response.keyword}</span>
                    <span className="text-xs text-muted-foreground ml-auto">Prioridad: {response.priority}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{response.response}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(response)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteResponse(response.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingResponse ? 'Editar Respuesta' : 'Nueva Respuesta'}
            </DialogTitle>
            <DialogDescription>
              Configura una palabra clave y la respuesta automática que el bot enviará.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Palabra Clave</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Horario, precio, ubicación..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respuesta</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nuestro horario de atención es..." 
                        {...field} 
                        rows={3} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridad (0-100)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">
                  {editingResponse ? 'Actualizar' : 'Crear'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
