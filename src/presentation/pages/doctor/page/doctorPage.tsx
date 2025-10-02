import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Calendar } from "../../../components/ui/calendar"
import { Card, CardContent } from "../../../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../components/ui/tabs"
import { User, CalendarDays, FileBarChart2, Video, ArrowRight, ClipboardList, RefreshCw } from "lucide-react"

export function DoctorPage() {
  return (
    <main className="flex-1 p-6  text-black">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-2xl shadow p-4 flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <User className="h-6 w-6 mb-2" />
                <span className="text-3xl font-bold">3</span>
                <span className="text-gray-600 font-medium">Pacientes Críticos</span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow p-4 flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <CalendarDays className="h-6 w-6 mb-2" />
                <span className="text-3xl font-bold">7</span>
                <span className="text-gray-600 font-medium">Citas Hoy</span>
              </CardContent>
            </Card>
            <Card className="rounded-2xl shadow p-4 flex items-center justify-center">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <FileBarChart2 className="h-6 w-6 mb-2" />
                <span className="text-3xl font-bold">5</span>
                <span className="text-gray-600 font-medium">Resultados Pendientes</span>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl shadow p-6">
            <CardContent className="p-0">
              <Input placeholder="Buscar pacientes" className="mb-4" />
              {/* Paciente seleccionado */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Paciente"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-bold">Isabel Garcia - 1055752032</h3>
                </div>
              </div>

              <Tabs defaultValue="historial" className="w-full">
                <TabsList>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                  <TabsTrigger value="medicamentos">Medicamentos</TabsTrigger>
                  <TabsTrigger value="consulta">Nueva consulta</TabsTrigger>
                </TabsList>
                <TabsContent value="historial" className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">12/03/24</p>
                    <p className="font-medium">Consulta por dolor abdominal</p>
                    <p className="text-gray-500 text-sm">Estado del día</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">25/03/24</p>
                    <p className="font-medium">Tratamiento por infección urinaria</p>
                    <p className="text-gray-500 text-sm">Examen: Urocultivo positivo</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">11/04/24</p>
                    <p className="font-medium">Control de diabetes mellitus tipo II</p>
                    <p className="text-gray-500 text-sm">Se ajusta medicación de metformina</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">18/04/24</p>
                    <p className="font-medium">Consulta por bronquitis aguda</p>
                    <p className="text-gray-500 text-sm">
                      Síntomas: Tos persistente, fiebre leve y cansancio
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="medicamentos">
                  <p className="text-gray-500">Listado de medicamentos…</p>
                </TabsContent>
                <TabsContent value="consulta">
                  <p className="text-gray-500">Formulario de nueva consulta…</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="rounded-2xl shadow p-4">
            <CardContent className="p-0">
              <Calendar mode="single" selected={new Date()} className="rounded-md" />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button variant="outline" className="justify-start gap-2 rounded-full">
              <Video className="h-5 w-5" /> Programar teleconsultas
            </Button>
            <Button variant="outline" className="justify-start gap-2 rounded-full">
              <ArrowRight className="h-5 w-5" /> Derivaciones
            </Button>
            <Button variant="outline" className="justify-start gap-2 rounded-full">
              <ClipboardList className="h-5 w-5" /> Tareas a enfermería
            </Button>
            <Button variant="outline" className="justify-start gap-2 rounded-full">
              <RefreshCw className="h-5 w-5" /> Renovación de receta
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
