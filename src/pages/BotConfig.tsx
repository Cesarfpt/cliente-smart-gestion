
import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BotConfigForm } from '@/components/Chat/BotConfigForm';
import { BotResponsesManager } from '@/components/Chat/BotResponsesManager';

const BotConfig = () => {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Configuración del Asistente Virtual</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Configuración General</TabsTrigger>
            <TabsTrigger value="responses">Respuestas Predefinidas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <BotConfigForm />
          </TabsContent>
          
          <TabsContent value="responses">
            <BotResponsesManager />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default BotConfig;
