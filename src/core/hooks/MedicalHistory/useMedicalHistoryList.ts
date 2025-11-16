import { useState, useCallback, useEffect } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import type { Pagination } from "../../types/medicalHistory";

interface MedicalHistoryListItem {
    id: string;
    patient: {
        id: string;
        fullname: string;
        identificacion: string;
        email?: string;
        historyNumber?: string;
    };
    totalDiagnostics: number;
    lastDiagnosticDate?: string;
    doctor: {
        id: string;
        fullname: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface MedicalHistoryFilters {
    searchTerm?: string;
    doctorId?: string;
    dateFrom?: string;
    dateTo?: string;
    patientName?: string;
    patientDocument?: string;
}

interface UseMedicalHistoryListOptions {
    enabled?: boolean;
    pageSize?: number;
    filters?: MedicalHistoryFilters;
}

interface UseMedicalHistoryListResult {
    medicalHistories: MedicalHistoryListItem[];
    pagination: Pagination | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
    filters: MedicalHistoryFilters;
    setFilters: (filters: MedicalHistoryFilters) => void;
    clearFilters: () => void;
    loadPage: (page: number) => Promise<void>;
    refresh: () => Promise<void>;
    searchByPatient: (searchTerm: string) => Promise<void>;
}

/**
 * Hook para gestionar el listado de historias clínicas con filtros y paginación
 */
export function useMedicalHistoryList(
    options: UseMedicalHistoryListOptions = {}
): UseMedicalHistoryListResult {
    const { enabled = true, pageSize = 10, filters: initialFilters = {} } = options;

    const [medicalHistories, setMedicalHistories] = useState<MedicalHistoryListItem[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(enabled);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<MedicalHistoryFilters>(initialFilters);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Función para cargar historias clínicas
    const loadMedicalHistories = useCallback(async (page: number = 1) => {
        if (!enabled) return;

        setIsLoading(true);
        setIsError(false);
        setErrorMessage(null);

        try {
            // Obtener todas las historias médicas con el nuevo servicio
            const allHistoriesResponse = await medicalHistoryService.getAllMedicalHistories({ 
                page: 1, 
                limit: 1000 // Obtener todas para poder filtrar y paginar en el frontend
            });

            let patientsWithHistories = allHistoriesResponse.patients || [];

            // Aplicar filtros de búsqueda
            if (filters.searchTerm || filters.patientName || filters.patientDocument) {
                const searchTerm = (filters.searchTerm || filters.patientName || filters.patientDocument || "").toLowerCase();
                patientsWithHistories = patientsWithHistories.filter(patient => 
                    patient.fullname.toLowerCase().includes(searchTerm) ||
                    patient.identificacion.includes(searchTerm) ||
                    (patient.email && patient.email.toLowerCase().includes(searchTerm))
                );
            }

            // Aplicar filtros de fecha y doctor
            if (filters.dateFrom || filters.dateTo || filters.doctorId) {
                patientsWithHistories = patientsWithHistories.filter(patient => {
                    if (!patient.medicalHistory) return false;

                    const matchesDateRange = (!filters.dateFrom || new Date(patient.medicalHistory.createdAt) >= new Date(filters.dateFrom)) &&
                                            (!filters.dateTo || new Date(patient.medicalHistory.createdAt) <= new Date(filters.dateTo));
                    
                    const matchesDoctor = !filters.doctorId || (patient.doctor && patient.doctor.id === filters.doctorId);
                    
                    return matchesDateRange && matchesDoctor;
                });
            }

            // Filtrar solo pacientes que tienen historia médica
            const patientsWithValidHistory = patientsWithHistories.filter(patient => patient.medicalHistory);

            // Formatear los datos para la interfaz
            const formattedHistories: MedicalHistoryListItem[] = patientsWithValidHistory.map(patient => ({
                id: patient.medicalHistory!.id,
                patient: {
                    id: patient.id,
                    fullname: patient.fullname,
                    identificacion: patient.identificacion,
                    email: patient.email,
                    historyNumber: patient.historyNumber
                },
                totalDiagnostics: patient.medicalHistory!.totalDiagnostics,
                lastDiagnosticDate: patient.medicalHistory!.lastDiagnosticDate || undefined,
                doctor: patient.doctor || {
                    id: "",
                    fullname: "Sin asignar",
                    email: ""
                },
                createdAt: patient.medicalHistory!.createdAt,
                updatedAt: patient.medicalHistory!.updatedAt
            }));

            // Ordenar por fecha de actualización (más recientes primero)
            formattedHistories.sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );

            // Aplicar paginación manual
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedHistories = formattedHistories.slice(startIndex, endIndex);

            setMedicalHistories(paginatedHistories);
            setPagination({
                page: page,
                limit: pageSize,
                total: formattedHistories.length,
                totalPages: Math.ceil(formattedHistories.length / pageSize)
            });

        } catch (error) {
            
            setIsError(true);
            setErrorMessage(
                error instanceof Error 
                    ? error.message 
                    : "Error al cargar las historias clínicas"
            );
        } finally {
            setIsLoading(false);
        }
    }, [enabled, pageSize, filters]);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        if (enabled) {
            loadMedicalHistories(currentPage);
        }
    }, [loadMedicalHistories, currentPage, enabled]);

    // Función para cambiar filtros
    const setFilters = useCallback((newFilters: MedicalHistoryFilters) => {
        setFiltersState(newFilters);
        setCurrentPage(1); // Resetear a la primera página
    }, []);

    // Función para limpiar filtros
    const clearFilters = useCallback(() => {
        setFiltersState({});
        setCurrentPage(1);
    }, []);

    // Función para cargar una página específica
    const loadPage = useCallback(async (page: number) => {
        setCurrentPage(page);
        await loadMedicalHistories(page);
    }, [loadMedicalHistories]);

    // Función para refrescar
    const refresh = useCallback(async () => {
        await loadMedicalHistories(currentPage);
    }, [loadMedicalHistories, currentPage]);

    // Función para buscar por paciente
    const searchByPatient = useCallback(async (searchTerm: string) => {
        setFilters({ ...filters, searchTerm });
    }, [filters, setFilters]);

    return {
        medicalHistories,
        pagination,
        isLoading,
        isError,
        errorMessage,
        filters,
        setFilters,
        clearFilters,
        loadPage,
        refresh,
        searchByPatient
    };
}