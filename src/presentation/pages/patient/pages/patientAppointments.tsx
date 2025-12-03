import { useEffect, useState } from "react";
import { Clock, CalendarDays, User2, Stethoscope, XCircle, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { appointmentsService } from "../../../../core/services/appointmentsService";
import { useCurrentUser } from "../../../../core/hooks/auth/useCurrentUser";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { PatientSidebar } from "../components/patientSidebar";

const MySwal = withReactContent(Swal);

interface Appointment {
    id: string;
    doctor: {
        name: string;
    }
    specialty: string;
    startTime: string;
    endTime: string;
    status: string;
}

export function PatientAppointments() {
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser();
    const patientId = user?.id;

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);

    // ────────────────────────────────
    // Obtener citas del paciente (excepto CANCELLED)
    // ────────────────────────────────
    const fetchAppointments = async () => {
        if (!patientId) return;

        setLoading(true);
        try {
            const { appointments: data } = await appointmentsService.filterAppointments({
                patientId,
            });

            const valid = (data || [])
                .filter((a) => a.status !== "CANCELLED")
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
        if (patientId) {
            fetchAppointments();
        }
    }, [patientId]);

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

    // Estado de carga del usuario
    if (userLoading) {
        return (
            <DashboardLayout
                sidebar={<PatientSidebar />}
                showSearch={false}
                headerHeightClass="pt-[80px]"
                contentMaxWidthClass="max-w-7xl"
                variant="inset"
                collapsible="icon"
            >
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    // Usuario no autenticado
    if (!isAuthenticated || !patientId) {
        return (
            <DashboardLayout
                sidebar={<PatientSidebar />}
                showSearch={false}
                headerHeightClass="pt-[80px]"
                contentMaxWidthClass="max-w-7xl"
                variant="inset"
                collapsible="icon"
            >
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-lg text-muted-foreground">Debes iniciar sesión para ver tus citas.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
        >
            <div className="w-full">
                <h2 className="text-3xl font-bold text-center text-foreground mb-10 tracking-tight">
                    Mis Citas Médicas
                </h2>

                {loading ? (
                    <p className="text-center text-primary font-medium animate-pulse">
                        Cargando citas...
                    </p>
                ) : appointments.length === 0 ? (
                    <p className="text-center text-muted-foreground italic">
                        Actualmente no tienes citas programadas para hoy.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {appointments.map((appt) => (
                            <div
                                key={appt.id}
                                className="bg-card shadow-xl border border-border rounded-3xl p-6 transition-all hover:shadow-2xl hover:-translate-y-1"
                            >
                                {/* Encabezado */}
                                <div className="flex items-center gap-3 mb-4">
                                    <User2 className="w-8 h-8 text-primary" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Dr. {appt.doctor.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Stethoscope className="w-4 h-4" />
                                            {appt.specialty}
                                        </div>
                                    </div>
                                </div>

                                {/* Fecha y hora */}
                                <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2 text-foreground">
                                        <CalendarDays className="w-5 h-5 text-primary" />
                                        <span className="capitalize">
                                            {new Date(appt.startTime).toLocaleDateString("es-ES", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-foreground">
                                        <Clock className="w-5 h-5 text-primary" />
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
                                                text: `Cita con Dr. ${appt.doctor.name}`,
                                                confirmButtonColor: "#2563eb",
                                            })
                                        }
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl font-medium shadow-sm transition-all"
                                    >
                                        Ver Detalles
                                    </button>

                                    <button
                                        onClick={() => handleCancelAppointment(appt.id)}
                                        className="flex items-center justify-center gap-1 flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground py-2 rounded-xl font-medium shadow-sm transition-all"
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
        </DashboardLayout>
    );
}
