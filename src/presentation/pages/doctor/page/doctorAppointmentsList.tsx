import { useState, useEffect } from "react";
import { Clock, CalendarDays, User2, CalendarCheck } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMyAppointments } from "../../../../core/hooks/appointments";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../components/doctorSideBar";

const MySwal = withReactContent(Swal);

export default function DoctorAppointmentsList() {
  const today = new Date().toLocaleDateString("en-CA");
  const [date, setDate] = useState(today);

  const { appointments, loading, error } = useMyAppointments({
    date,
    excludeCancelled: true,
  });

  useEffect(() => {
    if (error && error !== "Usuario no autenticado") {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error,
        confirmButtonColor: "#3b82f6",
      });
    }
  }, [error]);

  return (
    <DashboardLayout sidebar={<DoctorSidebar />} showSearch={false}>
      <div className="p-6 space-y-6">
        {/* Título */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
            <CalendarCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Citas Programadas</h1>
            <p className="text-muted-foreground">Consulta y gestión de tus citas médicas</p>
          </div>
        </div>

        {/* Filtro fecha */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-foreground">Selecciona una fecha:</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-border rounded-lg px-4 py-2 bg-input text-foreground shadow-sm focus:ring-2 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground mt-4">Cargando citas...</p>
            </div>
          </div>
        ) : error === "Usuario no autenticado" ? (
          <div className="flex justify-center items-center h-64">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-lg max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Sesión no válida. Por favor, inicia sesión nuevamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 mb-4 bg-muted rounded-full flex items-center justify-center">
              <CalendarCheck className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No hay citas programadas</p>
            <p className="text-sm text-muted-foreground">
              No tienes citas para la fecha seleccionada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full">
                    <User2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {a.patient.name || "Paciente sin nombre"}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="capitalize text-sm">
                      {new Date(a.startTime).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-foreground">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">
                      {new Date(a.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(a.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
