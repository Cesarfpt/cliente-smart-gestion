
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BotResponse {
  id: string;
  keyword: string;
  response: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

interface ResponseItemProps {
  response: BotResponse;
  onEdit: (response: BotResponse) => void;
  onDelete: (id: string) => void;
}

export const ResponseItem: React.FC<ResponseItemProps> = ({ response, onEdit, onDelete }) => {
  return (
    <div className="border rounded-md p-4 flex justify-between items-start">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">Palabra clave:</span>
          <span className="bg-muted px-2 py-1 rounded-md text-sm">{response.keyword}</span>
          <span className="text-xs text-muted-foreground ml-auto">Prioridad: {response.priority}</span>
        </div>
        <p className="text-sm text-muted-foreground">{response.response}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <Button variant="ghost" size="icon" onClick={() => onEdit(response)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(response.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};
