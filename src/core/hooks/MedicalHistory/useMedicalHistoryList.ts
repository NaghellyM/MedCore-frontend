import { useState, useCallback, useEffect } from "react";
import { medicalHistoryService } from "../../services/medicalHistoryService";
import { patientService } from "../../services/patientService";
import type { Pagination } from "../../types/medicalHistory";
import type { PatientSearchResult } from "../../types/patient";

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
    
    // Actions
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
            // Obtener lista de pacientes
            let patientResults: PatientSearchResult[] = [];
            
            // Si hay filtros de búsqueda, buscar pacientes específicos
            if (filters.searchTerm || filters.patientName || filters.patientDocument) {
                const searchTerm = filters.searchTerm || filters.patientName || filters.patientDocument || "";
                try {
                    const searchResponse = await patientService.searchPatients(searchTerm, 1, 100);
                    patientResults = searchResponse.patients;
                } catch (error) {
                
                    // Si falla la búsqueda, intentar obtener todos los pacientes
                    const allPatientsResponse = await patientService.getAllPatients(1, 100);
                    patientResults = allPatientsResponse.patients;
                }
            } else {
                // Si no hay filtros, obtener todos los pacientes
                const allPatientsResponse = await patientService.getAllPatients(1, 100);
                patientResults = allPatientsResponse.patients;
            }

            // Si tenemos filtros pero no encontramos pacientes, devolver lista vacía
            if ((filters.searchTerm || filters.patientName || filters.patientDocument) && patientResults.length === 0) {
                setMedicalHistories([]);
                setPagination({
                    page: 1,
                    limit: pageSize,
                    total: 0,
                    totalPages: 0
                });
                return;
            }

            // Obtener historias clínicas para cada paciente
            const historiesPromises = patientResults.map(async (patient) => {
                try {
                    // Usar el ID del paciente (no la identificación)
                    const historyResponse = await medicalHistoryService.getMedicalHistoryByPatientId(
                        patient.id, // Usar patient.id que es el ObjectId correcto
                        { page: 1, limit: 50 }
                    );
                    
                    return {
                        patient,
                        history: historyResponse
                    };
                } catch (error) {
                    // Silenciosamente ignorar pacientes sin historia clínica
                    return null;
                }
            });

            const historiesResults = await Promise.all(historiesPromises);

            // Procesar resultados y formatear datos
            const formattedHistories: MedicalHistoryListItem[] = [];
            
            for (const result of historiesResults) {
                if (result && result.history) {
                    const { patient, history } = result;
                    
                    
                    const matchesDateRange = (!filters.dateFrom || new Date(history.createdAt) >= new Date(filters.dateFrom)) &&
                                                (!filters.dateTo || new Date(history.createdAt) <= new Date(filters.dateTo));
                    
                    const matchesDoctor = !filters.doctorId || history.doctor.id === filters.doctorId;
                    
                    if (matchesDateRange && matchesDoctor) {
                        // Encontrar el diagnóstico más reciente
                        const lastDiagnostic = history.diagnostics.length > 0 
                            ? history.diagnostics.sort((a: any, b: any) => 
                                new Date(b.consultDate).getTime() - new Date(a.consultDate).getTime()
                            )[0]
                            : null;

                        formattedHistories.push({
                            id: history.id,
                            patient: {
                                id: patient.id, // Usar el ID correcto del paciente
                                fullname: patient.fullname,
                                identificacion: patient.identificacion,
                                email: patient.email,
                                historyNumber: patient.historyNumber
                            },
                            totalDiagnostics: history.diagnostics.length,
                            lastDiagnosticDate: lastDiagnostic?.consultDate,
                            doctor: history.doctor,
                            createdAt: history.createdAt,
                            updatedAt: history.updatedAt
                        });
                    }
                }
            }

            // Aplicar filtros adicionales si es necesario
            let filteredHistories = formattedHistories;

            // Los filtros principales ya se aplicaron arriba, solo aplicamos filtros adicionales si es necesario
            if (filters.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                filteredHistories = filteredHistories.filter(history => 
                    history.patient.fullname.toLowerCase().includes(searchTerm) ||
                    history.patient.identificacion.includes(searchTerm)
                );
            }

            // Ordenar por fecha de actualización (más recientes primero)
            filteredHistories.sort((a, b) => 
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );

            // Aplicar paginación
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedHistories = filteredHistories.slice(startIndex, endIndex);

            setMedicalHistories(paginatedHistories);
            setPagination({
                page: page,
                limit: pageSize,
                total: filteredHistories.length,
                totalPages: Math.ceil(filteredHistories.length / pageSize)
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