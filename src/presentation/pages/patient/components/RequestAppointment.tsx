import { useEffect, useState } from "react"
import { Clock, CalendarDays } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { doctorsService } from "../../../../core/services/doctorsService"
import { appointmentsService } from "../../../../core/services/appointmentsService"

const MySwal = withReactContent(Swal)

interface Appointment {
  startTime: string
  endTime: string
}

export default function RequestAppointment() {
  // ────────────────────────────────
  // ESTADOS
  // ────────────────────────────────
  const [specialties, setSpecialties] = useState<{ id: string; nombre: string }[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [availableSlots, setAvailableSlots] = useState<{ start: string; end: string }[]>([])
  const [loading, setLoading] = useState(false)

  const today = new Date().toLocaleDateString("en-CA")

  const [filters, setFilters] = useState({
    specialty: "",
    doctorId: "",
    date: today,
    startTime: "07:00",
    endTime: "18:00",
  })

  const selectedDoctor = doctors.find((doc) => doc.id === filters.doctorId)
  const patientId = "69090372f2a08c7fe006739a"

  // Auxiliar para evitar desfase horario
  function formatLocalDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number)
    const localDate = new Date(year, month - 1, day)
    return localDate.toISOString().split("T")[0]
  }

  // ────────────────────────────────
  // CARGAR ESPECIALIDADES
  // ────────────────────────────────
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await doctorsService.getSpecialties()
        setSpecialties(data)
      } catch {
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron obtener las especialidades.",
          confirmButtonColor: "#2563eb",
        })
      }
    }

    loadSpecialties()
  }, [])

  // ────────────────────────────────
  // CARGAR DOCTORES POR ESPECIALIDAD
  // ────────────────────────────────
  useEffect(() => {
    const loadDoctors = async () => {
      if (!filters.specialty) return

      try {
        const data = await doctorsService.filterBySpecialty(filters.specialty)
        setDoctors(data?.doctors || [])
      } catch {
        MySwal.fire({
          icon: "error",
          title: "Error al cargar doctores",
          text: "Ocurrió un problema al obtener los doctores.",
          confirmButtonColor: "#2563eb",
        })
      }
    }

    loadDoctors()
  }, [filters.specialty])

  // ────────────────────────────────
  // GENERAR INTERVALOS DE TIEMPO
  // ────────────────────────────────
  const generateTimeSlots = (start: string, end: string, interval: number) => {
    const times: string[] = []
    let [h, m] = start.split(":").map(Number)
    const [eh, em] = end.split(":").map(Number)

    while (h < eh || (h === eh && m < em)) {
      const hour = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
      times.push(hour)

      m += interval
      if (m >= 60) {
        h++
        m -= 60
      }
    }

    return times
  }

  // ────────────────────────────────
  // BUSCAR HORARIOS DISPONIBLES
  // ────────────────────────────────
  const fetchAppointments = async () => {
    if (!filters.doctorId) {
      setAvailableSlots([])
      return
    }

    setLoading(true)

    try {
      const data = await appointmentsService.filterAppointments({
        doctorId: filters.doctorId,
        startDate: filters.date,
        endDate: filters.date,
      })

      const booked: Appointment[] = (data.appointments || []).filter(
        (a) => a.status !== "CANCELLED"
      )

      const occupied = booked.map((a) => ({
        start: new Date(a.startTime),
        end: new Date(a.endTime),
      }))

      // Horarios sin almuerzo
      const slots = [
        ...generateTimeSlots(filters.startTime, "12:00", 30),
        ...generateTimeSlots("13:00", filters.endTime, 30),
      ]

      function createLocalDate(date: string, time: string) {
        return new Date(`${date}T${time}:00`)
      }

      const free = slots.filter((slot) => {
        const slotStart = createLocalDate(filters.date, slot)
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000)

        return !occupied.some((a) => slotStart < a.end && slotEnd > a.start)
      })

      const formatted = free.map((s) => {
        const slotStart = createLocalDate(filters.date, s)
        const slotEnd = new Date(slotStart.getTime() + 30 * 60000)

        return {
          start: s,
          end: slotEnd.toTimeString().slice(0, 5),
        }
      })

      setAvailableSlots(formatted)
    } catch {
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron obtener los horarios disponibles.",
        confirmButtonColor: "#2563eb",
      })
    } finally {
      setLoading(false)
    }
  }

  // AUTO ACTUALIZAR
  useEffect(() => {
    if (filters.doctorId && filters.date) {
      fetchAppointments()
    }
  }, [filters.doctorId, filters.date, filters.startTime, filters.endTime])

  // ────────────────────────────────
  // MANEJO DE INPUTS
  // ────────────────────────────────
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // ────────────────────────────────
  // RESERVAR CITA
  // ────────────────────────────────
  const handleReserve = async (slotStart: string) => {
    const startTime = `${filters.date}T${slotStart}:00`

    try {
      const result = await MySwal.fire({
        title: "¿Confirmar reserva?",
        text: `¿Deseas agendar la cita a las ${slotStart}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, reservar",
        cancelButtonText: "Cancelar",
      })

      if (!result.isConfirmed) return

      await appointmentsService.createAppointment({
        patientId,
        doctorId: filters.doctorId,
        startTime,
      })

      MySwal.fire({
        icon: "success",
        title: "Cita agendada con éxito",
        text: `Tu cita fue reservada para las ${slotStart}.`,
        confirmButtonColor: "#2563eb",
      })

      fetchAppointments()
      return
    } catch (error: any) {
      console.log(
        "este es el error",
        error.response?.data?.error,
        "status",
        error.response?.status
      )

      // Detectar cita duplicada
      if (
        error.response?.status === 400 &&
        error.response?.data?.error.includes("El paciente ya tiene una cita en ese horario.")
      ) {
        try {
          const existingAppointments = await appointmentsService.filterAppointments({
            patientId,
            startDate: filters.date,
            endDate: filters.date,
          })

          const conflict = existingAppointments.appointments.find((a: any) => {
            const existing = new Date(a.startTime)
            const requested = new Date(startTime)

            const sameDate =
              existing.toISOString().split("T")[0] === requested.toISOString().split("T")[0]

            const existingTime = existing.toTimeString().slice(0, 5)
            const requestedTime = requested.toTimeString().slice(0, 5)

            return sameDate && existingTime === requestedTime && a.status !== "CANCELLED"
          })

          if (conflict) {
            MySwal.fire({
              icon: "warning",
              title: "Ya tienes una cita en este horario",
              html: `
          
                <p style="font-size:16px; margin-bottom:8px">
                  <b>Doctor:</b> ${conflict.doctorId}<br>
                  <b>Fecha:</b> ${conflict.startTime.split("T")[0]}<br>
                  <b>Hora:</b> ${new Date(conflict.startTime)
                    .toTimeString()
                    .slice(0, 5)} - ${new Date(conflict.endTime)
                .toTimeString()
                .slice(0, 5)}
                </p>
              `,
              confirmButtonColor: "#2563eb",
            })
            return
          }
        } catch(e){
          console.log("erorr de erro:", e);
          
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: "Ya tienes una cita a esta hora.",
            confirmButtonColor: "#2563eb",
          })
          return
        }
      }

      // Otros errores
      MySwal.fire({
        icon: "error",
        title: "Error al agendar cita",
        text: "No se pudo reservar la cita. Intenta nuevamente.",
        confirmButtonColor: "#2563eb",
      })
    }
  }

  // ────────────────────────────────
  // FILTRAR HORAS PASADAS SI ES HOY
  // ────────────────────────────────
  const filteredSlots = availableSlots.filter((slot) => {
    const todayStr = new Date().toISOString().split("T")[0]

    if (filters.date !== todayStr) return true

    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`

    return slot.start > currentTime
  })

  // ────────────────────────────────
  // RENDER
  // ────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          🕒 Buscar horarios disponibles
        </h2>

        {/* FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Especialidad */}
          <div>
            <label className="block text-sm font-medium mb-1">Especialidad</label>
            <select
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione una especialidad</option>
              {specialties.map((s) => (
                <option key={s.id} value={s.nombre}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium mb-1">Doctor</label>
            <select
              name="doctorId"
              value={filters.doctorId}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              disabled={!filters.specialty || doctors.length === 0}
            >
              <option value="">
                {filters.specialty
                  ? doctors.length > 0
                    ? "Seleccione un doctor"
                    : "Sin doctores disponibles"
                  : "Seleccione una especialidad"}
              </option>

              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullname}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              name="date"
              min={today}
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hora inicial */}
          <div>
            <label className="block text-sm font-medium mb-1">Hora inicial</label>
            <input
              type="time"
              name="startTime"
              value={filters.startTime}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Hora final */}
          <div>
            <label className="block text-sm font-medium mb-1">Hora final</label>
            <input
              type="time"
              name="endTime"
              value={filters.endTime}
              onChange={handleFilterChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="mt-10">
          {loading ? (
            <p className="text-center text-blue-600 font-medium animate-pulse">
              Buscando horarios disponibles...
            </p>
          ) : filteredSlots.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              No hay horarios disponibles para esta fecha.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSlots.map((slot, i) => (
                <div
                  key={i}
                  className="border rounded-xl px-5 py-4 shadow-sm bg-white hover:shadow-md transition-all cursor-pointer"
                >
                  {selectedDoctor && (
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      {"Dr. " + selectedDoctor.fullname}
                    </p>
                  )}

                  <div className="flex flex-col items-center">
                    <p className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {slot.start} - {slot.end}
                    </p>

                    <button
                      onClick={() => handleReserve(slot.start)}
                      className="mt-4 w-full py-2 rounded-lg bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition"
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
