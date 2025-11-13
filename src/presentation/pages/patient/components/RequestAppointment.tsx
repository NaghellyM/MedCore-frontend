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

    const today = new Date().toLocaleDateString("en-CA") // → "YYYY-MM-DD" sin desfase


    const [filters, setFilters] = useState({
      specialty: "",
      doctorId: "",
      date: today,
      startTime: "07:00",
      endTime: "18:00",
    })

    // ID del paciente (ejemplo: reemplaza con tu sesión o estado global)
    const patientId = "69090372f2a08c7fe006739a"

    // Función auxiliar para formatear la fecha local sin desfase
    function formatLocalDate(dateString: string) {
      const [year, month, day] = dateString.split("-").map(Number)
      const localDate = new Date(year, month - 1, day, 0, 0, 0)
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
    // CARGAR DOCTORES SEGÚN ESPECIALIDAD
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
    // GENERAR HORARIOS DISPONIBLES
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
    // BUSCAR DISPONIBILIDAD
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

        const booked: Appointment[] = data.appointments || []
        const occupied = booked.map((a) => ({
    start: new Date(a.startTime),
    end: new Date(a.endTime),
  }))

        // Generar intervalos de 20 min (sin almuerzo)
        const slots = [
          ...generateTimeSlots(filters.startTime, "12:00", 30),
          ...generateTimeSlots("13:00", filters.endTime, 30),
        ]

        // Crear fecha local sin desfase horario
      function createLocalDate(date: string, time: string) {
    const d = new Date(`${date}T${time}:00`)
    d.setDate(d.getDate() + 1) // ✅ sumamos 1 día para compensar el desfase
    return d
  }




        // Filtrar los libres
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

    // ────────────────────────────────
    // AUTO-ACTUALIZAR AL CAMBIAR FILTROS
    // ────────────────────────────────
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

        // Refrescar la disponibilidad
        fetchAppointments()
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Error al agendar cita",
          text: "No se pudo reservar la cita. Intenta nuevamente.",
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
            ) : availableSlots.length === 0 ? (
              <p className="text-center text-gray-500 italic">
                No hay horarios disponibles para esta fecha.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSlots.map((slot, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all text-center"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
                      alt="Doctor"
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">
                      {doctors.find((d) => d.id === filters.doctorId)?.fullname || "Doctor"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {filters.specialty || "Especialidad"}
                    </p>

                    <div className="flex flex-col items-center gap-2 text-gray-700 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        <span>
                          {new Date(filters.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {slot.start} - {slot.end}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleReserve(slot.start)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all"
                    >
                      Reservar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
