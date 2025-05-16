
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useBotConfig } from '@/hooks/useBotConfig';

const formSchema = z.object({
  bot_name: z.string().min(2, { message: 'El nombre del bot debe tener al menos 2 caracteres.' }),
  greeting_message: z.string().min(10, { message: 'El mensaje de bienvenida debe tener al menos 10 caracteres.' }),
  farewell_message: z.string().min(10, { message: 'El mensaje de despedida debe tener al menos 10 caracteres.' }),
});

type FormValues = z.infer<typeof formSchema>;

export const BotConfigForm = () => {
  const { botConfig, loading: configLoading } = useBotConfig();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bot_name: botConfig?.bot_name || '',
      greeting_message: botConfig?.greeting_message || '',
      farewell_message: botConfig?.farewell_message || '',
    },
  });

  // Actualizar valores por defecto cuando se carga la configuración
  React.useEffect(() => {
    if (botConfig) {
      form.reset({
        bot_name: botConfig.bot_name,
        greeting_message: botConfig.greeting_message,
        farewell_message: botConfig.farewell_message,
      });
    }
  }, [botConfig, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user || !botConfig) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bot_config')
        .update({
          bot_name: data.bot_name,
          greeting_message: data.greeting_message,
          farewell_message: data.farewell_message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', botConfig.id);
        
      if (error) throw error;
      
      toast({
        title: 'Configuración actualizada',
        description: 'La configuración de tu bot ha sido actualizada correctamente.',
      });
    } catch (error: any) {
      console.error('Error updating bot config:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración del bot.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Bot</CardTitle>
          <CardDescription>Cargando configuración...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Bot</CardTitle>
        <CardDescription>Personaliza la apariencia y mensajes de tu asistente virtual.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bot_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Bot</FormLabel>
                  <FormControl>
                    <Input placeholder="Asistente Virtual" {...field} />
                  </FormControl>
                  <FormDescription>Este nombre aparecerá en el encabezado del chat.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="greeting_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje de Bienvenida</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?" 
                      {...field} 
                      rows={3} 
                    />
                  </FormControl>
                  <FormDescription>Este mensaje se mostrará al inicio de la conversación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="farewell_message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje de Despedida</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Gracias por tu consulta. ¡Hasta pronto!" 
                      {...field} 
                      rows={3} 
                    />
                  </FormControl>
                  <FormDescription>Este mensaje se mostrará al finalizar la conversación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
