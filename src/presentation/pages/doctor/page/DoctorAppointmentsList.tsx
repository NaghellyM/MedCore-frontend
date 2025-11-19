import { useState, useEffect } from "react";
import { Clock, CalendarDays, User2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useMyAppointments } from "../../../../core/hooks/appointments";
import BackButton from "../../encounter/components/button";

const MySwal = withReactContent(Swal);

export default function DoctorAppointmentsList() {
  const today = new Date().toLocaleDateString("en-CA");
  const [date, setDate] = useState(today);

  const { appointments, loading, error } = useMyAppointments({
    date,
    excludeCancelled: true,
  });

  // 
  useEffect(() => {
    if (error && error !== "Usuario no autenticado") {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error,
        confirmButtonColor: "#2563eb",
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        
        {/* Header con título y botón de volver */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex-1">
            <BackButton />
          </div>
          <h2 className="text-3xl font-bold text-center text-blue-700 tracking-tight flex-2">
            📘 MIS CITAS PROGRAMADAS
          </h2>
          <div className="flex-1"></div>
        </div>

        {/* Filtro fecha */}
        <div className="flex justify-center mb-10">
          <div className="bg-blue-50 p-4 rounded-2xl shadow-sm border border-blue-100">
            <label className="block text-sm font-semibold text-blue-700 mb-1 text-center">
              Selecciona una fecha
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-blue-200 rounded-xl px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Lista citas */}
        {loading ? (
          <p className="text-center text-blue-600 font-medium animate-pulse">
            Cargando citas...
          </p>
        ) : error === "Usuario no autenticado" ? (
          <div className="text-center p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Sesión no válida. Por favor, inicia sesión nuevamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No hay citas programadas para esta fecha.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 justify-items-center">
            {appointments.map((a) => (
              <div
                key={a.id}
                className="bg-white w-full max-w-xs rounded-3xl border border-gray-100 p-6 shadow-md hover:shadow-xl transition-all text-center"
              >
                <div className="flex justify-center mb  -4">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <User2 className="w-10 h-10 text-blue-700" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {a.patient.name || "Paciente sin nombre"}
                </h3>

                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span className="capitalize">
                    {new Date(a.startTime).toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
