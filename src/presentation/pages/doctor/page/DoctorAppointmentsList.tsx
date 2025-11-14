import { useEffect, useState } from "react";
import { Clock, CalendarDays, User2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { appointmentsService } from "../../../../core/services/appointmentsService";

const MySwal = withReactContent(Swal);

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  patientName?: string;
  status?: string;
}

export default function DoctorAppointmentsList() {
  const doctorId = "69069ad1441b83b718aef936";
  const today = new Date().toLocaleDateString("en-CA");

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(today);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentsService.filterAppointments({
        doctorId,
        startDate: date,
        endDate: date,
      });

      const filtered = (data.appointments || []).filter(
        (a: Appointment) => a.status !== "CANCELLED"
      );

      setAppointments(filtered);
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener las citas.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [date]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-5xl bg-white p-10 rounded-3xl shadow-xl border border-gray-100">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-10 tracking-tight">
          📘 MIS CITAS PROGRAMADAS
        </h2>

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
                  {a.patientName || "Paciente sin nombre"}
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
