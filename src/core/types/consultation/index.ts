/**
 * TIPOS PARA EL MÓDULO DE CONSULTA MÉDICA
 * ========================================
 * Definiciones de tipos para el flujo de consulta del doctor
 */

import type { QueuePatient } from '../queue';
import type { Diagnostic, MedicalHistory } from '../medicalHistory';
import type { Prescription } from '../prescription';
import type { MedicalOrderEntity } from '../medicalOrders';

// Estados del flujo de consulta
export type ConsultationStep = 
    | 'patient-info'      // Información del paciente
    | 'medical-history'   // Historia clínica
    | 'diagnostics'       // Diagnósticos
    | "documents"          // Documentos
    | 'prescriptions'     // Prescripciones
    | 'orders'            // Órdenes médicas (lab/radiología)
    | 'summary';          // Resumen y finalización

// Estado de la consulta
export type ConsultationStatus = 
    | 'PENDING'           // Pendiente de iniciar
    | 'IN_PROGRESS'       // En progreso
    | 'PAUSED'            // Pausada
    | 'COMPLETED'         // Completada
    | 'CANCELLED';        // Cancelada

// Información resumida del paciente para la consulta
export interface ConsultationPatientInfo {
    id: string;
    fullName: string;
    documentType: string;
    documentNumber: string;
    birthDate?: string;
    age?: number;
    gender?: string;
    phone?: string;
    email?: string;
    allergies?: string[];
}

// Datos de la consulta activa
export interface ActiveConsultation {
    id: string;
    queueItem: QueuePatient;
    patientInfo: ConsultationPatientInfo | null;
    medicalHistory: MedicalHistory | null;
    currentStep: ConsultationStep;
    status: ConsultationStatus;
    startedAt: string;
    lastUpdatedAt: string;
    // Elementos agregados durante la consulta
    newDiagnostics: string[];      // IDs de diagnósticos creados
    newPrescriptions: string[];    // IDs de prescripciones creadas
    newOrders: string[];           // IDs de órdenes creadas
    notes?: string;
}

// Props para el panel de consulta
export interface ConsultationPanelProps {
    patient: QueuePatient;
    onComplete: (appointmentId: string) => Promise<void>;
    onCancel: () => void;
    completing?: boolean;
    className?: string;
}

// Props para el selector de historia clínica
export interface MedicalHistorySelectorProps {
    patientId: string;
    onSelect: (historyId: string) => void;
    onCreateNew: () => void;
    selectedHistoryId?: string;
    className?: string;
}

// Props para la lista de diagnósticos en consulta
export interface ConsultationDiagnosticsProps {
    medicalHistoryId: string;
    patientId: string;
    diagnostics: Diagnostic[];
    onAddDiagnostic: () => void;
    onEditDiagnostic: (diagnosticId: string) => void;
    onViewDiagnostic: (diagnosticId: string) => void;
    loading?: boolean;
    className?: string;
}

// Props para las prescripciones en consulta
export interface ConsultationPrescriptionsProps {
    patientId: string;
    diagnosticId?: string;
    prescriptions: Prescription[];
    onAddPrescription: () => void;
    onViewPrescription: (prescriptionId: string) => void;
    loading?: boolean;
    className?: string;
}

// Props para las órdenes médicas en consulta
export interface ConsultationOrdersProps {
    patientId: string;
    doctorId: string;
    orders: MedicalOrderEntity[];
    onAddLaboratoryOrder: () => void;
    onAddRadiologyOrder: () => void;
    onViewOrder: (orderId: string) => void;
    loading?: boolean;
    className?: string;
}

// Props para el resumen de consulta
export interface ConsultationSummaryProps {
    consultation: ActiveConsultation;
    diagnostics: Diagnostic[];
    prescriptions: Prescription[];
    orders: MedicalOrderEntity[];
    onComplete: () => void;
    onBack: () => void;
    completing?: boolean;
    className?: string;
}

// Acciones disponibles en cada paso
export interface ConsultationStepActions {
    canGoBack: boolean;
    canGoNext: boolean;
    canComplete: boolean;
    nextLabel?: string;
    backLabel?: string;
}

// Navegación entre pasos
export interface ConsultationNavigation {
    currentStep: ConsultationStep;
    steps: ConsultationStep[];
    goToStep: (step: ConsultationStep) => void;
    goNext: () => void;
    goBack: () => void;
    getStepIndex: (step: ConsultationStep) => number;
    isFirstStep: boolean;
    isLastStep: boolean;
}

// Configuración de cada paso
export interface StepConfig {
    step: ConsultationStep;
    label: string;
    description: string;
    icon: string;
    required: boolean;
}

// Estado del hook useConsultation
export interface UseConsultationState {
    // Estado de la consulta
    consultation: ActiveConsultation | null;
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
    
    // Acciones
    startConsultation: (queueItem: QueuePatient) => Promise<void>;
    selectMedicalHistory: (historyId: string) => Promise<void>;
    createMedicalHistory: () => Promise<string>;
    addDiagnostic: (diagnosticId: string) => void;
    addPrescription: (prescriptionId: string) => void;
    addOrder: (orderId: string) => void;
    completeConsultation: () => Promise<void>;
    cancelConsultation: () => void;
    
    // Estados de carga individuales
    loadingPatient: boolean;
    loadingHistory: boolean;
    loadingDiagnostics: boolean;
    loadingPrescriptions: boolean;
    loadingOrders: boolean;
}

// Configuración de pasos de consulta
export const CONSULTATION_STEPS: StepConfig[] = [
    {
        step: 'patient-info',
        label: 'Paciente',
        description: 'Información del paciente',
        icon: 'User',
        required: true,
    },
    {
        step: 'medical-history',
        label: 'Historia Clínica',
        description: 'Seleccionar o crear historia clínica',
        icon: 'FileText',
        required: true,
    },
    {
        step: 'diagnostics',
        label: 'Diagnósticos',
        description: 'Gestionar diagnósticos',
        icon: 'Stethoscope',
        required: false,
    },
    {
        step: 'prescriptions',
        label: 'Prescripciones',
        description: 'Crear prescripciones médicas',
        icon: 'Pill',
        required: false,
    },
    {
        step: 'orders',
        label: 'Órdenes',
        description: 'Órdenes de laboratorio y radiología',
        icon: 'ClipboardList',
        required: false,
    },
    {
        step: 'summary',
        label: 'Resumen',
        description: 'Revisar y finalizar consulta',
        icon: 'CheckCircle',
        required: true,
    },
];
