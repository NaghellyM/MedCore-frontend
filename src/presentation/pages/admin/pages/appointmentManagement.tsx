import { useEffect, useState } from "react";
import { Clock, CalendarDays, Pencil, CalendarCheck, Search } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { doctorsService } from "../../../../core/services/doctorsService";
import { appointmentsService } from "../../../../core/services/appointmentsService";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { AdminSidebar } from "../components/adminSidebar";

const MySwal = withReactContent(Swal);

interface Doctor {
    id: string;
    fullname: string;
    specialty?: string;
}

interface Appointment {
    id: string;
    doctorId: string;
    doctor: { name: string };
    patientId?: string;
    patientName?: string;
    patient: { name: string };
    startTime: string;
    endTime: string;
    status?: string;
}

export default function AppointmentManagement() {
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

    // Cargar especialidades
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

    // Cargar doctores por especialidad
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
                const docs = res?.users || [];
                setDoctors(docs);

                setFilters((prev) => ({ ...prev, doctorId: docs[0]?.id || "" }));
            } catch {
                setDoctors([]);
            }
        };

        loadDoctors();
    }, [filters.specialty]);

    // Buscar citas
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

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    // Cambiar doctor con SweetAlert
    const handleChangeDoctor = async (appointment: Appointment) => {
        try {
            const specialty = filters.specialty;

            if (!specialty || specialty === "all") {
                await MySwal.fire({
                    icon: "error",
                    title: "Selecciona una especialidad",
                    text: "Debes elegir una especialidad antes de cambiar el doctor.",
                });
                return;
            }

            const res = await doctorsService.filterBySpecialty(specialty);
            const doctorsSame = res?.users || [];

            if (doctorsSame.length === 0) {
                await MySwal.fire({
                    icon: "info",
                    title: "Sin doctores disponibles",
                    text: "No hay doctores registrados en esta especialidad.",
                });
                return;
            }

            const { value: newDoctorId } = await MySwal.fire({
                title: "Cambiar Doctor",
                html: `
          <div style="padding: 16px; text-align: left;">
            <p style="margin-bottom: 12px; font-size: 14px; color: var(--muted-foreground, #64748b);">
              Selecciona el nuevo doctor para esta cita:
            </p>
            <select id="doctorSelect" class="swal2-select" style="
              width: 100%;
              padding: 12px;
              border-radius: 8px;
              border: 1px solid var(--border, #e2e8f0);
              font-size: 14px;
            ">
              <option value="">Seleccionar...</option>
              ${doctorsSame.map((d) => `<option value="${d.id}">${d.fullname}</option>`).join("")}
            </select>
          </div>
        `,
                confirmButtonText: "Actualizar",
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#3b82f6",
                cancelButtonColor: "#64748b",
                width: 420,
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

            await appointmentsService.updateDoctor(appointment.id, newDoctorId);

            await MySwal.fire({
                icon: "success",
                title: "Doctor actualizado",
                text: "La cita ha sido reasignada correctamente.",
                confirmButtonColor: "#3b82f6",
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

    const getStatusBadge = (status?: string) => {
        if (!status) return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
        const s = status.toUpperCase();
        if (s === "CANCELLED") return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
        if (s === "SCHEDULED" || s === "CONFIRMED") return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    };

    return (
        <DashboardLayout sidebar={<AdminSidebar />} showSearch={false}>
            <div className="p-6 space-y-6">
                {/* Título */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                        <CalendarCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
                        <p className="text-muted-foreground">Administración y seguimiento de citas médicas</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Especialidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Especialidad</label>
                            <select
                                name="specialty"
                                value={filters.specialty}
                                onChange={handleChange}
                                className="w-full p-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary transition-colors"
                            >
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Doctor</label>
                            <select
                                name="doctorId"
                                value={filters.doctorId}
                                onChange={handleChange}
                                className="w-full p-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary transition-colors"
                            >
                                {filters.specialty === "all" && <option value="all">Todos</option>}
                                {doctors.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.fullname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Fecha</label>
                            <input
                                type="date"
                                name="date"
                                min={today}
                                value={filters.date}
                                onChange={handleChange}
                                className="w-full p-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary transition-colors"
                            />
                        </div>

                        {/* Paciente */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">ID Paciente</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    name="patientId"
                                    value={filters.patientId}
                                    onChange={handleChange}
                                    placeholder="Buscar..."
                                    className="w-full p-3 pl-10 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition-colors"
                                />
                            </div>
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Estado</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleChange}
                                className="w-full p-3 border border-border rounded-lg bg-input text-foreground focus:ring-2 focus:ring-primary transition-colors"
                            >
                                <option value="all">Todos</option>
                                <option value="SCHEDULED">Programada</option>
                                <option value="CONFIRMED">Confirmada</option>
                                <option value="CANCELLED">Cancelada</option>
                            </select>
                        </div>
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
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-20 h-20 mb-4 bg-muted rounded-full flex items-center justify-center">
                            <CalendarCheck className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No se encontraron citas.</p>
                        <p className="text-sm text-muted-foreground">
                            Intenta cambiar los filtros o seleccionar otra fecha.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map((a) => (
                            <div
                                key={a.id}
                                className="p-6 rounded-xl border border-border shadow-lg bg-card hover:shadow-xl transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-foreground text-lg">Dr. {a.doctor.name}</h3>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(a.status)}`}>
                                        {a.status === "SCHEDULED"
                                            ? "Programada"
                                            : a.status === "CONFIRMED"
                                                ? "Confirmada"
                                                : a.status === "CANCELLED"
                                                    ? "Cancelada"
                                                    : a.status}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4">
                                    Paciente: <span className="font-medium text-foreground">{a.patient.name || "No registrado"}</span>
                                </p>

                                <div className="space-y-2 text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays className="w-4 h-4" />
                                        <span className="text-sm">
                                            {new Date(a.startTime).toLocaleDateString("es-ES", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">
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

                                <button
                                    onClick={() => handleChangeDoctor(a)}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors font-medium"
                                >
                                    <Pencil className="w-4 h-4" /> Cambiar Doctor
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
