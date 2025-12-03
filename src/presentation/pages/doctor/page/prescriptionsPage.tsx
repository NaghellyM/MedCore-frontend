import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Pill, Plus, Eye, Search } from "lucide-react";
import { Breadcrumbs } from "../../../components/navigation/Breadcrumbs";
import { AutoDashboardLayout } from "../../../layouts/autoDashboardLayout";

/**
 * Página de Recetas Médicas para el médico
 * Permite crear y consultar recetas electrónicas
 */
export function PrescriptionsPage() {
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
              <Pill className="h-8 w-8 text-pink-600" />
              Recetas Médicas
            </h1>
            <p className="text-muted-foreground mt-2">
              Crea y consulta recetas electrónicas para tus pacientes
            </p>
          </div>
          <Button
            onClick={() => navigate("/prescriptions/new")}
            className="bg-pink-600 hover:bg-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Receta
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por paciente, medicamento o fecha..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <Button variant="outline">
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de recetas recientes */}
      <div className="grid gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>María González</CardTitle>
                <CardDescription>Receta #RX-2024-001 • 25/11/2024</CardDescription>
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
                <strong>Medicamentos:</strong> Amoxicilina 500mg, Ibuprofeno 400mg
              </p>
              <p className="text-muted-foreground">
                <strong>Estado:</strong> <span className="text-green-600 font-medium">Activa</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder para más recetas */}
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No hay más recetas recientes
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/prescriptions/new")}
            >
              Crear Nueva Receta
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </AutoDashboardLayout>
  );
}
