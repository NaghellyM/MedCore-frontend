import { useEffect, useState } from "react"
import { Clock, CalendarDays } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { appointmentsService } from "../../../../core/services/appointmentsService"

const MySwal = withReactContent(Swal)

interface Appointment {
  id: string
  startTime: string
  endTime: string
  patientName?: string
  status?: string
}

export default function DoctorAppointmentsList() {
  // ────────────────────────────────
  // ID FIJO DEL DOCTOR
  // ────────────────────────────────
  const doctorId = "69069ad1441b83b718aef936"

  // ────────────────────────────────
  // ESTADOS
  // ────────────────────────────────
  const today = new Date().toLocaleDateString("en-CA")

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState(today)

  // ────────────────────────────────
  // CARGAR CITAS DEL DOCTOR
  // ────────────────────────────────
  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const data = await appointmentsService.filterAppointments({
        doctorId,
        startDate: date,
        endDate: date,
      })

      // 🔹 Filtrar citas que no estén canceladas
      const filtered = (data.appointments || []).filter(
        (a: Appointment) => a.status !== "CANCELLED"
      )

      setAppointments(filtered)
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener las citas del doctor.",
        confirmButtonColor: "#2563eb",
      })
    } finally {
      setLoading(false)
    }
  }

  // Autoactualizar al cambiar la fecha
  useEffect(() => {
    fetchAppointments()
  }, [date])

  // ────────────────────────────────
  // CANCELAR CITA
  // ────────────────────────────────
  const handleCancel = async (appointmentId: string) => {
    const result = await MySwal.fire({
      title: "¿Cancelar cita?",
      text: "¿Seguro que deseas cancelar esta cita?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    })

    if (!result.isConfirmed) return

    try {
      await appointmentsService.cancelAppointment(appointmentId)
      MySwal.fire({
        icon: "success",
        title: "Cita cancelada",
        confirmButtonColor: "#2563eb",
      })
      fetchAppointments()
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la cita.",
        confirmButtonColor: "#2563eb",
      })
    }
  }

  // ────────────────────────────────
  // RENDER
  // ────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          📋 Lista de citas del día
        </h2>

        {/* FILTRO FECHA */}
        <div className="flex justify-center mb-8">
          <div>
            <label className="block text-sm font-medium mb-1 text-center">Fecha</label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* LISTADO */}
        {loading ? (
          <p className="text-center text-blue-600 font-medium animate-pulse">
            Cargando citas...
          </p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No hay citas activas para esta fecha.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((a, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-center"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                  alt="Paciente"
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-blue-700 mb-1">
                  Paciente: {a.patientName || "No registrado"}
                </h3>

                <div className="flex flex-col items-center gap-2 text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {new Date(a.startTime).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(a.startTime).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(a.endTime).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancel(a.id)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-all"
                >
                  Cancelar cita
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
