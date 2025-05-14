
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Componente de panel de control
const Dashboard = () => {
  const { toast } = useToast();

  const showIntegrationNotice = () => {
    toast({
      title: "Supabase no conectado",
      description: "Para ver datos reales, conecta tu proyecto a Supabase",
      variant: "destructive",
    });
  };

  // En una implementación real, estos datos vendrían de una API
  const mockStats = {
    totalClientes: 152,
    clientesNuevos: 12,
    totalPedidos: 87,
    pedidosPendientes: 14,
    totalVendedores: 8,
    vendedoresActivos: 6,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Vista General</TabsTrigger>
              <TabsTrigger value="analytics">Analíticas</TabsTrigger>
              <TabsTrigger value="reports">Reportes</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              {/* Cards de estadísticas */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card onClick={showIntegrationNotice} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Totales</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalClientes}</div>
                    <p className="text-xs text-muted-foreground">
                      +{mockStats.clientesNuevos} nuevos en los últimos 30 días
                    </p>
                  </CardContent>
                </Card>
                
                <Card onClick={showIntegrationNotice} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalPedidos}</div>
                    <p className="text-xs text-muted-foreground">
                      {mockStats.pedidosPendientes} pedidos pendientes
                    </p>
                  </CardContent>
                </Card>
                
                <Card onClick={showIntegrationNotice} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalVendedores}</div>
                    <p className="text-xs text-muted-foreground">
                      {mockStats.vendedoresActivos} activos actualmente
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Panel de actividad reciente */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>
                      Las últimas interacciones con clientes y pedidos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Esta sección tendría datos reales en una implementación con Supabase */}
                      <div className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Nuevo cliente registrado</p>
                          <p className="text-sm text-muted-foreground">
                            Cliente: María Rodríguez - CP: 28001
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">Hace 2 horas</div>
                      </div>
                      <div className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Nuevo pedido creado</p>
                          <p className="text-sm text-muted-foreground">
                            Pedido #2023-056 - Cliente: Juan Pérez
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">Hace 5 horas</div>
                      </div>
                      <div className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Pedido enviado</p>
                          <p className="text-sm text-muted-foreground">
                            Pedido #2023-048 - Cliente: Ana López
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">Hace 1 día</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Tarjeta de próximos eventos */}
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Próximos Eventos</CardTitle>
                    <CardDescription>
                      Actividades programadas para los próximos días.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Entrega programada</p>
                          <p className="text-sm text-muted-foreground">
                            5 pedidos pendientes de entrega
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">Mañana</div>
                      </div>
                      <div className="flex items-center gap-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">Reunión de vendedores</p>
                          <p className="text-sm text-muted-foreground">
                            Revisión de objetivos mensuales
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">En 2 días</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analíticas</CardTitle>
                  <CardDescription>
                    Visualiza las métricas de rendimiento de tu negocio.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Conecta con Supabase para ver analíticas en tiempo real.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reportes</CardTitle>
                  <CardDescription>
                    Genera informes detallados de tu actividad comercial.
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Conecta con Supabase para generar reportes personalizados.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>
                    Revisa tus notificaciones recientes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No tienes notificaciones actualmente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
