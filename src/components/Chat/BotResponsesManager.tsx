
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ResponseItem } from './ResponseItem';
import { ResponseForm, BotResponseFormValues } from './ResponseForm';
import { useBotResponses, BotResponse } from '@/hooks/useBotResponses';

export const BotResponsesManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<BotResponse | null>(null);
  const { responses, loading, handleDeleteResponse, handleSaveResponse } = useBotResponses();
  
  const openAddDialog = () => {
    setEditingResponse(null);
    setDialogOpen(true);
  };

  const openEditDialog = (response: BotResponse) => {
    setEditingResponse(response);
    setDialogOpen(true);
  };

  const onSubmit = async (data: BotResponseFormValues) => {
    await handleSaveResponse(data, editingResponse?.id || null);
    setDialogOpen(false);
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
              <ResponseItem 
                key={response.id} 
                response={response}
                onEdit={openEditDialog}
                onDelete={handleDeleteResponse}
              />
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
          
          <ResponseForm 
            onSubmit={onSubmit}
            defaultValues={editingResponse ? {
              keyword: editingResponse.keyword,
              response: editingResponse.response,
              priority: editingResponse.priority,
            } : undefined}
            isEditing={!!editingResponse}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
