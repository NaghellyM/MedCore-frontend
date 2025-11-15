import { useState, useEffect, useCallback, useRef } from "react";
import { patientService } from "../../../../core/services/patientService";
import type { PatientSearchResult } from "../../../../core/types/patient";
import type { PatientSearchState } from "../../../../core/types/medicalHistory";

interface UsePatientSearchOptions {
    debounceMs?: number;
    minQueryLength?: number;
    autoLoadRecent?: boolean;
}

interface UsePatientSearchReturn extends PatientSearchState {
    searchPatients: (query: string) => void;
    selectPatient: (patient: PatientSearchResult) => void;
    clearSearch: () => void;
    clearSelection: () => void;
    loadRecentPatients: () => void;
}

export function usePatientSearch(
    options: UsePatientSearchOptions = {}
): UsePatientSearchReturn {
    const {
        debounceMs = 500,
        minQueryLength = 2,
        autoLoadRecent = true
    } = options;

    const [state, setState] = useState<PatientSearchState>({
        query: "",
        results: [],
        selectedPatient: null,
        isSearching: false,
        showResults: false,
        recentPatients: [],
        error: null
    });

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Función para buscar pacientes
    const performSearch = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < minQueryLength) {
            setState(prev => ({
                ...prev,
                results: [],
                showResults: false,
                isSearching: false,
                error: null
            }));
            return;
        }

        // Cancelar búsqueda anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController();

        setState(prev => ({
            ...prev,
            isSearching: true,
            error: null,
            showResults: true
        }));

        try {
            const response = await patientService.searchPatients(
                searchQuery,
                1, // Primera página
                10 // Límite de resultados
            );

            // Verificar si la búsqueda no fue cancelada
            if (!abortControllerRef.current?.signal.aborted) {
                setState(prev => ({
                    ...prev,
                    results: response.patients,
                    isSearching: false,
                    error: null
                }));
            }
        } catch (error) {
            if (!abortControllerRef.current?.signal.aborted) {
                setState(prev => ({
                    ...prev,
                    results: [],
                    isSearching: false,
                    error: "Error al buscar pacientes. Intente nuevamente."
                }));
            }
        }
    }, [minQueryLength]);

    // Función pública para iniciar búsqueda con debounce
    const searchPatients = useCallback((query: string) => {
        setState(prev => ({
            ...prev,
            query,
            selectedPatient: null // Limpiar selección al buscar
        }));

        // Limpiar timeout anterior
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Si la query está vacía, mostrar pacientes recientes
        if (!query.trim()) {
            setState(prev => ({
                ...prev,
                results: [],
                showResults: prev.recentPatients.length > 0,
                isSearching: false,
                error: null
            }));
            return;
        }

        // Configurar debounce
        debounceTimeoutRef.current = setTimeout(() => {
            performSearch(query.trim());
        }, debounceMs);
    }, [performSearch, debounceMs]);

    // Función para seleccionar un paciente
    const selectPatient = useCallback((patient: PatientSearchResult) => {
        setState(prev => ({
            ...prev,
            selectedPatient: patient,
            query: patient.fullname,
            showResults: false,
            error: null
        }));
    }, []);

    // Función para limpiar la búsqueda
    const clearSearch = useCallback(() => {
        setState(prev => ({
            ...prev,
            query: "",
            results: [],
            showResults: false,
            isSearching: false,
            error: null
        }));

        // Limpiar timeouts y abort controllers
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    }, []);

    // Función para limpiar solo la selección
    const clearSelection = useCallback(() => {
        setState(prev => ({
            ...prev,
            selectedPatient: null,
            query: "",
            showResults: prev.recentPatients.length > 0
        }));
    }, []);

    // Función para cargar pacientes recientes
    const loadRecentPatients = useCallback(async () => {
        try {
            const recentPatients = await patientService.getRecentPatients(5);
            setState(prev => ({
                ...prev,
                recentPatients,
                showResults: !prev.query && recentPatients.length > 0
            }));
        } catch (error) {
            console.error("Error loading recent patients:", error);
        }
    }, []);

    // Cargar pacientes recientes al montar el componente
    useEffect(() => {
        if (autoLoadRecent) {
            loadRecentPatients();
        }
    }, [autoLoadRecent, loadRecentPatients]);

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        ...state,
        searchPatients,
        selectPatient,
        clearSearch,
        clearSelection,
        loadRecentPatients
    };
}