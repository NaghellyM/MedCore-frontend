import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { ClipboardList, Plus, Eye, Search, FlaskConical, Scan } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Breadcrumbs } from "../../../components/navigation/Breadcrumbs";
import { AutoDashboardLayout } from "../../../layouts/autoDashboardLayout";

/**
 * Página de Órdenes Médicas para el médico
 * Permite generar órdenes de laboratorio y radiología
 */
export function OrdersPage() {
    const navigate = useNavigate();

    return (
        <AutoDashboardLayout showSearch={false}>
            <div className="p-6">
                {/* Breadcrumbs */}
                <Breadcrumbs />

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                <ClipboardList className="h-8 w-8 text-cyan-600" />
                                Órdenes Médicas
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Genera y consulta órdenes de laboratorio y radiología
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs de tipo de orden */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="lab">Laboratorio</TabsTrigger>
                        <TabsTrigger value="imaging">Radiología</TabsTrigger>
                    </TabsList>

                    {/* Búsqueda */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por paciente, tipo de examen o fecha..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                </div>
                                <Button variant="outline">Filtros</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contenido de tabs */}
                    <TabsContent value="all" className="space-y-4">
                        {/* Orden de ejemplo */}
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Juan Pérez</CardTitle>
                                        <CardDescription>Orden #LAB-2024-045 • 28/11/2024</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p className="text-muted-foreground">
                                        <strong>Tipo:</strong> Laboratorio
                                    </p>
                                    <p className="text-muted-foreground">
                                        <strong>Exámenes:</strong> Hemograma completo, Glucosa, Perfil lipídico
                                    </p>
                                    <p className="text-muted-foreground">
                                        <strong>Estado:</strong> <span className="text-yellow-600 font-medium">Pendiente</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>Ana Martínez</CardTitle>
                                        <CardDescription>Orden #RAD-2024-023 • 27/11/2024</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="h-4 w-4 mr-2" />
                                        Ver
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <p className="text-muted-foreground">
                                        <strong>Tipo:</strong> Radiología
                                    </p>
                                    <p className="text-muted-foreground">
                                        <strong>Estudio:</strong> Radiografía de tórax PA y lateral
                                    </p>
                                    <p className="text-muted-foreground">
                                        <strong>Estado:</strong> <span className="text-green-600 font-medium">Completado</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Placeholder */}
                        <Card className="border-dashed border-2">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center">
                                    No hay más órdenes médicas
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="lab">
                        <Card className="border-dashed border-2">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center mb-4">
                                    No hay órdenes de laboratorio
                                </p>
                                <Button onClick={() => navigate("/orders/laboratory/new")}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Orden de Laboratorio
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="imaging">
                        <Card className="border-dashed border-2">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Scan className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-center mb-4">
                                    No hay órdenes de radiología
                                </p>
                                <Button onClick={() => navigate("/orders/radiology/new")}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Orden de Radiología
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AutoDashboardLayout>
    );
}
