
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChatStatsProps {
  totalMessages: number;
  userMessages: number;
  botMessages: number;
  averageResponseTime: number;
  mostCommonKeywords: { keyword: string; count: number }[];
}

export const ChatStats: React.FC<ChatStatsProps> = ({
  totalMessages,
  userMessages,
  botMessages,
  averageResponseTime,
  mostCommonKeywords
}) => {
  const messageTypeData = [
    { name: 'Usuario', value: userMessages },
    { name: 'Bot', value: botMessages },
  ];

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Mensajes</CardTitle>
          <CardDescription>Distribución de mensajes entre usuarios y respuestas del bot</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={messageTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {messageTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} mensajes`, 'Cantidad']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            Total de mensajes: {totalMessages} | Tiempo medio de respuesta: {averageResponseTime}ms
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Palabras Clave Comunes</CardTitle>
          <CardDescription>Las palabras clave más utilizadas en las conversaciones</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={mostCommonKeywords}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Frecuencia" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
