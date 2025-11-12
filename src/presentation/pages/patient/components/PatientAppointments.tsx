import { useEffect, useState } from "react";
import { Clock, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { appointmentsService } from "../../../../core/services/appointmentsService";
import { id } from "date-fns/locale";

const MySwal = withReactContent(Swal);

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  startTime: string;
  endTime: string;
  status: string; // "CONFIRMED", "PENDING", "CANCELLED"
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    date: today,
    startTime: "07:00",
    endTime: "18:00",
  });

  const patientId = "69090372f2a08c7fe006739a";

  // ────────────────────────────────
  // Manejo de filtros
  // ────────────────────────────────
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ────────────────────────────────
  // Obtener citas filtradas
  // ────────────────────────────────
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const startTimeISO = `${filters.date}T${filters.startTime}:00-05:00`;
      const endTimeISO = `${filters.date}T${filters.endTime}:00-05:00`;

      const { appointments: data } = await appointmentsService.filterAppointments({
        patientId,
        startTime: startTimeISO,
        endTime: endTimeISO,
      });

      // Mostrar solo las que NO estén canceladas
      setAppointments((data || []).filter((appt) => appt.status !== "CANCELLED"));
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
  }, [filters.date, filters.startTime, filters.endTime]);

  // ────────────────────────────────
  // Cancelar cita
  // ────────────────────────────────
  const handleCancelAppointment = async (appointmentId: string) => {
    console.log("id cita:", appointmentId);
    
    const result = await MySwal.fire({
      title: "¿Deseas cancelar esta cita?",
      text: "Esta acción no se puede deshacer",
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
        fetchAppointments(); // Refrescar la lista
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

  // ────────────────────────────────
  // Render
  // ────────────────────────────────
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          📅 Mis citas
        </h2>

        {/* FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              min={today}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora inicio</label>
            <input
              type="time"
              name="startTime"
              value={filters.startTime}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hora fin</label>
            <input
              type="time"
              name="endTime"
              value={filters.endTime}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* LISTA DE CITAS */}
        {loading ? (
          <p className="text-center text-blue-600 font-medium animate-pulse">
            Cargando citas...
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No hay citas disponibles.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-blue-700 mb-1">
                    {appt.doctorName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{appt.specialty}</p>

                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 bg-green-100 text-green-800">
                    {appt.status}
                  </span>

                  <div className="flex flex-col items-center gap-2 text-gray-700 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        {new Date(appt.startTime).toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
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
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      MySwal.fire({
                        icon: "info",
                        title: "Cita seleccionada",
                        text: `Cita con ${appt.doctorName} a las ${new Date(
                          appt.startTime
                        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
                        confirmButtonColor: "#2563eb",
                      })
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(appt.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-all"
                  >
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
