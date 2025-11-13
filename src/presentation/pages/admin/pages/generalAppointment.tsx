import { useEffect, useState } from "react"
import { Clock, CalendarDays } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { doctorsService } from "../../../../core/services/doctorsService"
import { appointmentsService } from "../../../../core/services/appointmentsService"

const MySwal = withReactContent(Swal)

interface Appointment {
  id: string
  startTime: string
  endTime: string
  patientName?: string
}

export default function GeneralAppointment() {
  // ────────────────────────────────
  // ESTADOS
  // ────────────────────────────────
  const [specialties, setSpecialties] = useState<{ id: string; nombre: string }[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const today = new Date().toLocaleDateString("en-CA")

  const [filters, setFilters] = useState({
    specialty: "",
    doctorId: "",
    date: today,
  })

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
  // BUSCAR CITAS EXISTENTES
  // ────────────────────────────────
  const fetchAppointments = async () => {
    if (!filters.doctorId) {
      setAppointments([])
      return
    }

    setLoading(true)
    try {
      const data = await appointmentsService.filterAppointments({
        doctorId: filters.doctorId,
        startDate: filters.date,
        endDate: filters.date,
      })

      setAppointments(data.appointments || [])
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

  // Autoactualizar al cambiar filtros
  useEffect(() => {
    if (filters.doctorId && filters.date) {
      fetchAppointments()
    }
  }, [filters.doctorId, filters.date])

  // ────────────────────────────────
  // MANEJO DE INPUTS
  // ────────────────────────────────
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // ────────────────────────────────
  // RENDER
  // ────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          📋 Lista de citas del doctor
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
        </div>

        {/* RESULTADOS */}
        <div className="mt-10">
          {loading ? (
            <p className="text-center text-blue-600 font-medium animate-pulse">
              Cargando citas...
            </p>
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-500 italic">
              No hay citas para esta fecha.
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

                  <p className="text-sm text-gray-600 italic">
                    Paciente: {a.patientName || "No registrado"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
