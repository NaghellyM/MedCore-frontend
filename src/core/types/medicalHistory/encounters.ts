/**
 * ENCUENTROS MÉDICOS (ENCOUNTERS)
 * ===============================
 * Este archivo contiene los tipos específicos para encuentros/consultas médicas
 */

import type { PatientBasicMedical, VitalSigns, Diagnosis, Medication, MedicalOrder } from "./entities";

// Payload para crear un encuentro médico
export interface EncounterPayload {
    allergies: any;
    patient: PatientBasicMedical;
    encounter: {
        type: string;
        allergies: any;
        modeTelemedicine: any;
        date_time: string;
        location?: string | null;
        mode: "teleconsulta" | "presencial";
        chief_complaint: string;
        history_of_present_illness?: string;
        review_of_systems?: string;
        physical_exam?: string;
        patient_education?: string;
        plan?: string;
        vitals: VitalSigns;
        diagnoses: Diagnosis[];
        prescriptions: Medication[];
        orders: MedicalOrder[];
    };
    audit: { created_at: string };
}