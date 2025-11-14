// --- IMPORTS IGUAL QUE ANTES ---
import { useEffect, useState } from "react";
import { Clock, CalendarDays, Pencil } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { doctorsService } from "../../../../core/services/doctorsService";
import { appointmentsService } from "../../../../core/services/appointmentsService";

const MySwal = withReactContent(Swal);

interface Doctor {
  id: string;
  fullname: string;
  specialty?: string;
}

interface Appointment {
  id: string;
  doctorId: string;
  patientId?: string;
  patientName?: string;
  startTime: string;
  endTime: string;
  status?: string;
}

export default function GeneralAppointment() {
  const [specialties, setSpecialties] = useState<{ id: string; nombre: string }[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  const [filters, setFilters] = useState({
    specialty: "all",
    doctorId: "all",
    date: today,
    patientId: "",
    status: "all",
  });

  // CARGAR ESPECIALIDADES
  useEffect(() => {
    const load = async () => {
      try {
        const data = await doctorsService.getSpecialties();
        setSpecialties([{ id: "all", nombre: "Todas" }, ...(data || [])]);
      } catch {
        MySwal.fire("Error", "No se pudieron obtener las especialidades.", "error");
      }
    };
    load();
  }, []);

  // CARGAR DOCTORES POR ESPECIALIDAD
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        if (filters.specialty === "all") {
          if ((doctorsService as any).getAllDoctors) {
            const res = await (doctorsService as any).getAllDoctors();
            setDoctors(res?.doctors || res || []);
          }
          setFilters((prev) => ({ ...prev, doctorId: "all" }));
          return;
        }

        const res = await doctorsService.filterBySpecialty(filters.specialty);
        const docs = res?.doctors || [];
        setDoctors(docs);

        setFilters((prev) => ({ ...prev, doctorId: docs[0]?.id || "" }));
      } catch {
        setDoctors([]);
      }
    };

    loadDoctors();
  }, [filters.specialty]);

  // BUSCAR CITAS
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const payload: any = {
        startDate: filters.date,
        endDate: filters.date,
      };

      if (filters.patientId.trim() !== "") payload.patientId = filters.patientId.trim();
      if (filters.doctorId !== "all") payload.doctorId = filters.doctorId;

      const data = await appointmentsService.filterAppointments(payload);

      let list: Appointment[] = data.appointments || [];

      if (filters.status !== "all") {
        list = list.filter((a) => a.status?.toUpperCase() === filters.status.toUpperCase());
      }

      setAppointments(list);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters.doctorId, filters.date, filters.patientId, filters.specialty, filters.status]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // CAMBIAR DOCTOR CON SWEETALERT
  const handleChangeDoctor = async (appointment: Appointment) => {
  try {
    const specialty = filters.specialty;

    // Validar especialidad seleccionada
    if (!specialty || specialty === "all") {
      await MySwal.fire({
        icon: "error",
        title: "Selecciona una especialidad",
        text: "Debes elegir una especialidad antes de cambiar el doctor.",
      });
      return;
    }

    // Obtener doctores de la misma especialidad
    const res = await doctorsService.filterBySpecialty(specialty);
    const doctorsSame = res?.doctors || [];

    if (doctorsSame.length === 0) {
      await MySwal.fire({
        icon: "info",
        title: "Sin doctores disponibles",
        text: "No hay doctores registrados en esta especialidad.",
      });
      return;
    }

    // ------------------------------
    // 🔥 ALARMA MEJORADA Y ELEGANTE
    // ------------------------------
    const { value: newDoctorId } = await MySwal.fire({
      title: `
        <div style="font-size: 26px; font-weight: bold; color: #1e40af;">
          Cambiar Doctor
        </div>
      `,
      html: `
        <div style="padding: 20px; text-align: left; background: #f8fafc; border-radius: 16px;">
          <p style="margin-bottom: 10px; font-size: 15px; color:#334155;">
            Selecciona el nuevo doctor para esta cita:
          </p>

          <select id="doctorSelect" style="
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #cbd5e1;
            background: white;
            font-size: 15px;
          ">
            <option value="">Seleccionar...</option>
            ${doctorsSame
              .map((d) => `<option value="${d.id}">${d.fullname}</option>`)
              .join("")}
          </select>
        </div>
      `,
      confirmButtonText: "Actualizar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      width: 450,
      focusConfirm: false,

      preConfirm: () => {
        const select = document.getElementById("doctorSelect") as HTMLSelectElement;
        if (!select.value) {
          MySwal.showValidationMessage("Debes seleccionar un doctor");
          return false;
        }
        return select.value;
      },
    });

    if (!newDoctorId) return;

    // ------------------------------
    // 🔥 LLAMADA REAL AL BACKEND
    // ------------------------------
    await appointmentsService.updateDoctor(appointment.id, newDoctorId);

    await MySwal.fire({
      icon: "success",
      title: "Doctor actualizado",
      text: "La cita ha sido reasignada correctamente.",
      confirmButtonColor: "#2563eb",
    });

    fetchAppointments();
  } catch (err) {
    console.error(err);
    MySwal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo cambiar el doctor.",
    });
  }
};



  const getDoctorName = (id?: string) => {
    const d = doctors.find((x) => x.id === id);
    return d?.fullname || "Doctor";
  };

  const statusBadge = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700";
    const s = status.toUpperCase();
    if (s === "CANCELLED") return "bg-red-100 text-red-700";
    if (s === "SCHEDULED" || s === "CONFIRMED") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  // RENDER
  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-blue-50 to-white min-h-screen p-8">
      <div className="w-full max-w-6xl bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          🔍 Buscador General de Citas
        </h2>

        {/* FILTROS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">

          {/* Especialidad */}
          <div>
            <label>Especialidad</label>
            <select name="specialty" value={filters.specialty} onChange={handleChange} className="w-full p-3 border rounded-xl">
              <option value="all">Todas</option>
              {specialties
                .filter((s) => s.id !== "all")
                .map((s) => (
                  <option key={s.id} value={s.nombre}>
                    {s.nombre}
                  </option>
                ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label>Doctor</label>
            <select name="doctorId" value={filters.doctorId} onChange={handleChange} className="w-full p-3 border rounded-xl">
              {filters.specialty === "all" && <option value="all">Todos</option>}
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.fullname}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label>Fecha</label>
            <input
              type="date"
              name="date"
              min={today}
              value={filters.date}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* Paciente */}
          <div>
            <label>ID Paciente</label>
            <input
              name="patientId"
              value={filters.patientId}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            />
          </div>

          {/* Estado */}
          <div>
            <label>Estado</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
            >
              <option value="all">Todos</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* RESULTADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {appointments.map((a) => (
            <div key={a.id} className="p-6 rounded-3xl border shadow-lg bg-white">

              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{getDoctorName(a.doctorId)}</h3>
                <div className={`text-sm px-3 py-1 rounded-full ${statusBadge(a.status)}`}>
                  {a.status}
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Paciente: <strong>{a.patientName || "No registrado"}</strong>
              </p>

              <div className="mt-3 text-gray-600 flex flex-col">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4" />
                  {new Date(a.startTime).toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4" />
                  {new Date(a.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(a.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* BOTÓN EDITAR CON SWEETALERT */}
              <button
                onClick={() => handleChangeDoctor(a)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
              >
                <Pencil className="w-4" /> Editar Doctor
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
