/**
 * TRANSFORMADORES DE DATOS DE HISTORIA MÉDICA
 * ===========================================
 * Centraliza todas las transformaciones de datos entre diferentes formatos
 */

import type {
    MedicalHistory,
    Diagnostic,
    MedicalHistoryFormData,
} from "../types/medicalHistory";
import type { PatientSearchResult, Patient } from "../types/patient";

/**
 * Convierte MedicalHistory a formato de formulario
 */
export function transformHistoryToFormData(
    history: MedicalHistory,
    patient?: Patient | PatientSearchResult
): Partial<MedicalHistoryFormData> {
    const diagnostics = history.diagnostics || [];
    const firstDiagnostic = diagnostics[0];

    // Información del paciente
    const patientInfo: PatientSearchResult = patient ? {
        id: patient.id || history.patientId,
        fullname: patient.fullname || "Paciente",
        identificacion: patient.identificacion || '',
        email: patient.email,
    } : {
        id: history.patientId,
        fullname: "Paciente",
        identificacion: "",
    };

    const formData: Partial<MedicalHistoryFormData> = {
        patientInfo,
    };

    // Si hay diagnósticos, mapear el primero a las secciones del formulario
    if (firstDiagnostic) {
        formData.consultation = {
            chiefComplaint: firstDiagnostic.title || "",
            currentIllnessHistory: firstDiagnostic.description || "",
            consultDate: firstDiagnostic.consultDate?.split('T')[0] || new Date().toISOString().split('T')[0]
        };

        formData.physicalExam = {
            vitalSigns: firstDiagnostic.vitalSigns 
                ? (typeof firstDiagnostic.vitalSigns === 'string' 
                    ? JSON.parse(firstDiagnostic.vitalSigns) 
                    : firstDiagnostic.vitalSigns)
                : {},
            generalAppearance: firstDiagnostic.physicalExam || "",
            systemicExam: ""
        };

        formData.diagnostics = {
            symptoms: firstDiagnostic.symptoms || "",
            clinicalFindings: firstDiagnostic.observations || "",
            primaryDiagnosis: firstDiagnostic.diagnosis || "",
            secondaryDiagnosis: "",
            diagnosticImpression: firstDiagnostic.treatment || ""
        };
    }

    return formData;
}

/**
 * Enriquece una historia médica con información del paciente
 */
export function enrichHistoryWithPatient(
    history: MedicalHistory,
    patient: Patient
): MedicalHistory & { patientFullName: string } {
    return {
        ...history,
        patientFullName: patient.fullname || "Paciente",
    };
}

/**
 * Obtiene el nombre completo de un paciente de diferentes formatos
 */
export function getPatientFullName(patient: Patient | PatientSearchResult | undefined): string {
    if (!patient) return "Paciente";
    return patient.fullname || "Paciente";
}

/**
 * Transforma un diagnóstico para actualización
 */
export function transformDiagnosticForUpdate(diagnostic: Diagnostic) {
    return {
        title: diagnostic.title,
        description: diagnostic.description || "",
        symptoms: diagnostic.symptoms || "",
        diagnosis: diagnostic.diagnosis || "",
        treatment: diagnostic.treatment || "",
        observations: diagnostic.observations || "",
        prescriptions: diagnostic.prescriptions || "",
        physicalExam: diagnostic.physicalExam || "",
        vitalSigns: diagnostic.vitalSigns || "",
        consultDate: diagnostic.consultDate.split('T')[0],
        nextAppointment: diagnostic.nextAppointment?.split('T')[0] || ""
    };
}

/**
 * Valida si una historia médica tiene datos completos
 */
export function isHistoryComplete(history: MedicalHistory | null): boolean {
    if (!history) return false;
    return !!(
        history.id &&
        history.patientId &&
        history.diagnostics &&
        history.diagnostics.length > 0
    );
}
