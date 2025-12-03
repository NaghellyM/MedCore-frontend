import { useState, useCallback, useMemo } from 'react';
import { patientService } from '../../services/patientService';
import { medicalHistoryService } from '../../services/medicalHistoryService';
import { prescriptionService } from '../../services/prescriptionService';
import { medicalOrdersService } from '../../services/medicalOrdersService';
import { diagnosticService } from '../../services/diagnosticService';
import type { QueuePatient } from '../../types/queue';
import type { Diagnostic, MedicalHistory } from '../../types/medicalHistory';
import type { Prescription } from '../../types/prescription';
import type { MedicalOrderEntity } from '../../types/medicalOrders';
import type {
    ConsultationStep,
    ConsultationPatientInfo,
    ActiveConsultation,
    ConsultationNavigation,
} from '../../types/consultation';

const STEPS_ORDER: ConsultationStep[] = [
    'patient-info',
    'medical-history',
    'diagnostics',
    'prescriptions',
    'orders',
    'summary',
];

interface UseConsultationOptions {
    onComplete?: () => void;
    onError?: (error: string) => void;
}

interface UseConsultationReturn {
    // Estado de la consulta
    consultation: ActiveConsultation | null;
    isActive: boolean;
    loading: boolean;
    error: string | null;

    // Navegación
    currentStep: ConsultationStep;
    navigation: ConsultationNavigation;

    // Datos cargados
    patientInfo: ConsultationPatientInfo | null;
    medicalHistory: MedicalHistory | null;
    diagnostics: Diagnostic[];
    prescriptions: Prescription[];
    orders: MedicalOrderEntity[];

    // Acciones principales
    startConsultation: (queueItem: QueuePatient) => Promise<void>;
    selectMedicalHistory: (historyId: string) => Promise<void>;
    createMedicalHistory: () => Promise<string | null>;
    refreshDiagnostics: () => Promise<void>;
    refreshPrescriptions: () => Promise<void>;
    refreshOrders: () => Promise<void>;
    completeConsultation: () => void;
    cancelConsultation: () => void;

    // Registro de elementos creados
    addCreatedDiagnostic: (diagnosticId: string) => void;
    addCreatedPrescription: (prescriptionId: string) => void;
    addCreatedOrder: (orderId: string) => void;

    // Estados de carga individuales
    loadingPatient: boolean;
    loadingHistory: boolean;
    loadingDiagnostics: boolean;
    loadingPrescriptions: boolean;
    loadingOrders: boolean;
}

/**
 * Hook para gestionar el flujo completo de una consulta médica
 * Maneja la navegación entre pasos, carga de datos y registro de elementos creados
 */
export function useConsultation(options: UseConsultationOptions = {}): UseConsultationReturn {
    const { onComplete, onError } = options;

    // Estado principal
    const [consultation, setConsultation] = useState<ActiveConsultation | null>(null);
    const [currentStep, setCurrentStep] = useState<ConsultationStep>('patient-info');
    const [error, setError] = useState<string | null>(null);

    // Datos del paciente
    const [patientInfo, setPatientInfo] = useState<ConsultationPatientInfo | null>(null);
    const [loadingPatient, setLoadingPatient] = useState(false);

    // Historia clínica
    const [medicalHistory, setMedicalHistory] = useState<MedicalHistory | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Diagnósticos
    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
    const [loadingDiagnostics, setLoadingDiagnostics] = useState(false);

    // Prescripciones
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

    // Órdenes médicas
    const [orders, setOrders] = useState<MedicalOrderEntity[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Estado de carga general
    const loading = loadingPatient || loadingHistory || loadingDiagnostics || loadingPrescriptions || loadingOrders;

    // Indica si hay una consulta activa
    const isActive = consultation !== null && consultation.status === 'IN_PROGRESS';

    // Calcular edad a partir de fecha de nacimiento
    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Cargar información del paciente
    const loadPatientInfo = useCallback(async (patientId: string) => {
        setLoadingPatient(true);
        setError(null);
        try {
            const patient = await patientService.getPatientById(patientId);
            // Usar las propiedades correctas del tipo Patient
            const info: ConsultationPatientInfo = {
                id: patient.id,
                fullName: patient.fullname,
                documentType: 'CC', // Tipo por defecto
                documentNumber: patient.identificacion,
                birthDate: patient.date_of_birth,
                age: patient.date_of_birth ? calculateAge(patient.date_of_birth) : undefined,
                gender: undefined, // No disponible directamente en Patient
                phone: patient.phone || undefined,
                email: patient.email || undefined,
                allergies: [], // Se cargará desde la historia clínica
            };
            setPatientInfo(info);
            return info;
        } catch (err: any) {
            const errorMsg = err?.message || 'Error al cargar información del paciente';
            setError(errorMsg);
            onError?.(errorMsg);
            return null;
        } finally {
            setLoadingPatient(false);
        }
    }, [onError]);

    // Cargar historia clínica del paciente
    const loadMedicalHistory = useCallback(async (patientId: string) => {
        setLoadingHistory(true);
        try {
            const response = await medicalHistoryService.getMedicalHistoryByPatientId(patientId);
            // La respuesta extiende MedicalHistory directamente
            if (response && response.id) {
                setMedicalHistory(response as MedicalHistory);
                return response as MedicalHistory;
            }
            return null;
        } catch (err: any) {
            // Si no existe historia clínica, no es un error crítico
            console.log('No se encontró historia clínica para el paciente');
            return null;
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    // Cargar diagnósticos del paciente
    // Usamos el endpoint de diagnósticos por paciente para obtener datos actualizados
    // Solo mostramos diagnósticos ACTIVOS (excluye DELETED y ARCHIVED)
    const refreshDiagnostics = useCallback(async () => {
        if (!patientInfo?.id) return;
        
        setLoadingDiagnostics(true);
        try {
            // Obtener solo diagnósticos activos
            const response = await diagnosticService.getDiagnosticsByPatientId(
                patientInfo.id,
                'ACTIVE' // Filtrar solo diagnósticos activos
            );
            setDiagnostics(response.data || []);
        } catch (err: any) {
            console.error('Error al cargar diagnósticos:', err);
            setDiagnostics([]);
        } finally {
            setLoadingDiagnostics(false);
        }
    }, [patientInfo?.id]);

    // Cargar prescripciones del paciente
    const refreshPrescriptions = useCallback(async () => {
        if (!patientInfo?.id) return;

        setLoadingPrescriptions(true);
        try {
            const response = await prescriptionService.getPrescriptionsByPatientId(patientInfo.id);
            // La respuesta usa 'data' en lugar de 'prescriptions'
            setPrescriptions(response.data || []);
        } catch (err: any) {
            console.error('Error al cargar prescripciones:', err);
        } finally {
            setLoadingPrescriptions(false);
        }
    }, [patientInfo?.id]);

    // Cargar órdenes médicas del paciente
    const refreshOrders = useCallback(async () => {
        if (!patientInfo?.id) return;

        setLoadingOrders(true);
        try {
            // El servicio ahora devuelve un array directo
            const ordersArray = await medicalOrdersService.getOrdersByPatientId(patientInfo.id);
            setOrders(Array.isArray(ordersArray) ? ordersArray : []);
        } catch (err: any) {
            console.error('Error al cargar órdenes médicas:', err);
        } finally {
            setLoadingOrders(false);
        }
    }, [patientInfo?.id]);

    // Iniciar consulta
    const startConsultation = useCallback(async (queueItem: QueuePatient) => {
        setError(null);
        
        const newConsultation: ActiveConsultation = {
            id: `consultation-${Date.now()}`,
            queueItem,
            patientInfo: null,
            medicalHistory: null,
            currentStep: 'patient-info',
            status: 'IN_PROGRESS',
            startedAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            newDiagnostics: [],
            newPrescriptions: [],
            newOrders: [],
        };

        setConsultation(newConsultation);
        setCurrentStep('patient-info');

        // Cargar información del paciente
        const patient = await loadPatientInfo(queueItem.patientId);
        if (patient) {
            setConsultation(prev => prev ? { ...prev, patientInfo: patient } : null);
            
            // Intentar cargar historia clínica existente usando el ID correcto del paciente
            const history = await loadMedicalHistory(patient.id);
            if (history) {
                setConsultation(prev => prev ? { ...prev, medicalHistory: history } : null);
            }
        }
    }, [loadPatientInfo, loadMedicalHistory]);

    // Seleccionar historia clínica existente
    const selectMedicalHistory = useCallback(async (historyId: string) => {
        setLoadingHistory(true);
        try {
            const response = await medicalHistoryService.getMedicalHistoryById(historyId);
            // La respuesta usa 'data' que contiene el MedicalHistory
            if (response.data) {
                setMedicalHistory(response.data as MedicalHistory);
                setConsultation(prev => prev ? { 
                    ...prev, 
                    medicalHistory: response.data as MedicalHistory,
                    lastUpdatedAt: new Date().toISOString(),
                } : null);
                
                // Cargar diagnósticos de esta historia
                await refreshDiagnostics();
            }
        } catch (err: any) {
            const errorMsg = err?.message || 'Error al cargar historia clínica';
            setError(errorMsg);
            onError?.(errorMsg);
        } finally {
            setLoadingHistory(false);
        }
    }, [refreshDiagnostics, onError]);

    // Crear nueva historia clínica
    const createMedicalHistory = useCallback(async (): Promise<string | null> => {
        if (!patientInfo?.id) {
            setError('No hay paciente seleccionado');
            return null;
        }

        setLoadingHistory(true);
        try {
            const response = await medicalHistoryService.createMedicalHistory(patientInfo.id);
            // La respuesta usa 'data' que contiene la historia creada
            if (response.data) {
                // Crear objeto MedicalHistory a partir de la respuesta
                const newHistory: MedicalHistory = {
                    id: response.data.id,
                    patientId: response.data.patientId,
                    createdBy: response.data.createdBy,
                    createdAt: response.data.createdAt,
                    updatedAt: response.data.updatedAt,
                    diagnostics: [],
                    doctor: { id: '', fullname: '', email: '' },
                };
                setMedicalHistory(newHistory);
                setConsultation(prev => prev ? {
                    ...prev,
                    medicalHistory: newHistory,
                    lastUpdatedAt: new Date().toISOString(),
                } : null);
                return response.data.id;
            }
            return null;
        } catch (err: any) {
            const errorMsg = err?.message || 'Error al crear historia clínica';
            setError(errorMsg);
            onError?.(errorMsg);
            return null;
        } finally {
            setLoadingHistory(false);
        }
    }, [patientInfo?.id, onError]);

    // Registrar diagnóstico creado
    const addCreatedDiagnostic = useCallback((diagnosticId: string) => {
        setConsultation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                newDiagnostics: [...prev.newDiagnostics, diagnosticId],
                lastUpdatedAt: new Date().toISOString(),
            };
        });
        refreshDiagnostics();
    }, [refreshDiagnostics]);

    // Registrar prescripción creada
    const addCreatedPrescription = useCallback((prescriptionId: string) => {
        setConsultation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                newPrescriptions: [...prev.newPrescriptions, prescriptionId],
                lastUpdatedAt: new Date().toISOString(),
            };
        });
        refreshPrescriptions();
    }, [refreshPrescriptions]);

    // Registrar orden creada
    const addCreatedOrder = useCallback((orderId: string) => {
        setConsultation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                newOrders: [...prev.newOrders, orderId],
                lastUpdatedAt: new Date().toISOString(),
            };
        });
        refreshOrders();
    }, [refreshOrders]);

    // Completar consulta
    const completeConsultation = useCallback(() => {
        setConsultation(prev => {
            if (!prev) return null;
            return {
                ...prev,
                status: 'COMPLETED',
                lastUpdatedAt: new Date().toISOString(),
            };
        });
        onComplete?.();
    }, [onComplete]);

    // Cancelar consulta
    const cancelConsultation = useCallback(() => {
        setConsultation(null);
        setPatientInfo(null);
        setMedicalHistory(null);
        setDiagnostics([]);
        setPrescriptions([]);
        setOrders([]);
        setCurrentStep('patient-info');
        setError(null);
    }, []);

    // Navegación entre pasos
    const navigation: ConsultationNavigation = useMemo(() => {
        const currentIndex = STEPS_ORDER.indexOf(currentStep);
        
        return {
            currentStep,
            steps: STEPS_ORDER,
            goToStep: (step: ConsultationStep) => {
                setCurrentStep(step);
                setConsultation(prev => prev ? {
                    ...prev,
                    currentStep: step,
                    lastUpdatedAt: new Date().toISOString(),
                } : null);
            },
            goNext: () => {
                if (currentIndex < STEPS_ORDER.length - 1) {
                    const nextStep = STEPS_ORDER[currentIndex + 1];
                    setCurrentStep(nextStep);
                    setConsultation(prev => prev ? {
                        ...prev,
                        currentStep: nextStep,
                        lastUpdatedAt: new Date().toISOString(),
                    } : null);
                }
            },
            goBack: () => {
                if (currentIndex > 0) {
                    const prevStep = STEPS_ORDER[currentIndex - 1];
                    setCurrentStep(prevStep);
                    setConsultation(prev => prev ? {
                        ...prev,
                        currentStep: prevStep,
                        lastUpdatedAt: new Date().toISOString(),
                    } : null);
                }
            },
            getStepIndex: (step: ConsultationStep) => STEPS_ORDER.indexOf(step),
            isFirstStep: currentIndex === 0,
            isLastStep: currentIndex === STEPS_ORDER.length - 1,
        };
    }, [currentStep]);

    return {
        // Estado
        consultation,
        isActive,
        loading,
        error,

        // Navegación
        currentStep,
        navigation,

        // Datos
        patientInfo,
        medicalHistory,
        diagnostics,
        prescriptions,
        orders,

        // Acciones
        startConsultation,
        selectMedicalHistory,
        createMedicalHistory,
        refreshDiagnostics,
        refreshPrescriptions,
        refreshOrders,
        completeConsultation,
        cancelConsultation,

        // Registro de elementos
        addCreatedDiagnostic,
        addCreatedPrescription,
        addCreatedOrder,

        // Estados de carga
        loadingPatient,
        loadingHistory,
        loadingDiagnostics,
        loadingPrescriptions,
        loadingOrders,
    };
}
