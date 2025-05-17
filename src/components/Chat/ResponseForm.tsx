
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

const formSchema = z.object({
  keyword: z.string().min(2, { message: 'La palabra clave debe tener al menos 2 caracteres.' }),
  response: z.string().min(10, { message: 'La respuesta debe tener al menos 10 caracteres.' }),
  priority: z.number().int().min(0).max(100),
});

export type BotResponseFormValues = z.infer<typeof formSchema>;

interface ResponseFormProps {
  onSubmit: (data: BotResponseFormValues) => Promise<void>;
  defaultValues?: BotResponseFormValues;
  isEditing: boolean;
}

export const ResponseForm: React.FC<ResponseFormProps> = ({ 
  onSubmit, 
  defaultValues = { keyword: '', response: '', priority: 0 },
  isEditing
}) => {
  const form = useForm<BotResponseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
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
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
