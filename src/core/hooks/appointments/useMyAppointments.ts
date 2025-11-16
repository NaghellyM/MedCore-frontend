import { useState, useEffect, useCallback } from "react";
import { appointmentsService } from "../../services/appointmentsService";
import { useCurrentUser } from "../auth";

interface Appointment {
    id: string;
    startTime: string;
    endTime: string;
    patient: {
        name: string;
    };
    status?: string;
}

interface UseMyAppointmentsOptions {
    date?: string;
    excludeCancelled?: boolean;
}

interface UseMyAppointmentsReturn {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Hook para obtener las citas del doctor autenticado
 * Responsabilidad única: Gestionar el estado y obtención de citas del doctor logueado
 */
export function useMyAppointments(
    options: UseMyAppointmentsOptions = {}
): UseMyAppointmentsReturn {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated, loading: userLoading } = useCurrentUser();
    const { date, excludeCancelled = true } = options;

    const fetchAppointments = useCallback(async () => {
        // Si aún está cargando el usuario, no hacer nada
        if (userLoading) {
            return;
        }

        // Verificar que el usuario esté autenticado después de que termine de cargar
        if (!isAuthenticated || !user?.id) {
            setError("Usuario no autenticado");
            return;
        }

        setAppointmentsLoading(true);
        setError(null);

        try { 
            const data = await appointmentsService.filterAppointments({
                doctorId: user.id,
                startDate: date,
                endDate: date,
            });

            let filteredAppointments = data.appointments || [];

            // Filtrar citas canceladas si está habilitado
            if (excludeCancelled) {
                filteredAppointments = filteredAppointments.filter(
                    (appointment: Appointment) => appointment.status !== "CANCELLED"
                );
            }

            setAppointments(filteredAppointments);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError("No se pudieron obtener las citas.");
            setAppointments([]);
        } finally {
            setAppointmentsLoading(false);
        }
    }, [user?.id, isAuthenticated, userLoading, date, excludeCancelled]);

    // Efecto para cargar las citas cuando cambian las dependencias
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    return {
        appointments,
        loading: userLoading || appointmentsLoading,
        error,
        refetch: fetchAppointments,
    };
}