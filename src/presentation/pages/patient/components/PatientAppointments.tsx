import { useEffect, useState } from "react";
import { Clock, CalendarDays, User2, Stethoscope, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { appointmentsService } from "../../../../core/services/appointmentsService";

const MySwal = withReactContent(Swal);

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const patientId = "69090372f2a08c7fe006739a";

  // ────────────────────────────────
  // Obtener citas del paciente (excepto CANCELLED)
  // ────────────────────────────────
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { appointments: data } = await appointmentsService.filterAppointments({
        patientId,
      });

      const valid = (data || [])
        .filter((a) => a.status !== "CANCELLED") // 👈 FILTRO AQUÍ
        .sort(
          (a, b) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

      setAppointments(valid);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las citas.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ────────────────────────────────
  // Cancelar cita
  // ────────────────────────────────
  const handleCancelAppointment = async (appointmentId: string) => {
    const result = await MySwal.fire({
      title: "¿Deseas cancelar esta cita?",
      text: "Recuerde que no se puede cancelar cita 30 minutos antes de la misma. Esta acción es PERMANENTE",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        await appointmentsService.cancelAppointment(appointmentId);
        MySwal.fire({
          icon: "success",
          title: "Cita cancelada",
          confirmButtonColor: "#2563eb",
        });

        fetchAppointments();
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cancelar la cita",
          confirmButtonColor: "#2563eb",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-6xl">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-10 tracking-tight">
          📅 Mis Citas Médicas
        </h2>

        {loading ? (
          <p className="text-center text-blue-600 font-medium animate-pulse">
            Cargando citas...
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No tienes citas activas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white shadow-xl border border-gray-100 rounded-3xl p-6 transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Encabezado */}
                <div className="flex items-center gap-3 mb-4">
                  <User2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appt.doctorName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Stethoscope className="w-4 h-4" />
                      {appt.specialty}
                    </div>
                  </div>
                </div>

                

                {/* Fecha y hora */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2 text-gray-700">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    <span className="capitalize">
                      {new Date(appt.startTime).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-bold">
                      {new Date(appt.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(appt.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() =>
                      MySwal.fire({
                        icon: "info",
                        title: "Cita seleccionada",
                        text: `Cita con ${appt.doctorName}`,
                        confirmButtonColor: "#2563eb",
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium shadow-sm transition-all"
                  >
                    Ver Detalles
                  </button>

                  <button
                    onClick={() => handleCancelAppointment(appt.id)}
                    className="flex items-center justify-center gap-1 flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium shadow-sm transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
