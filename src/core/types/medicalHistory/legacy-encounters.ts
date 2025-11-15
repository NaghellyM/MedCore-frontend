export type DiagnosisType = "principal" | "secundario";
export type OrderType = "lab" | "imagen" | "interconsulta";
export type OrderStatus = "pendiente" | "en_proceso" | "listo";

export type DiagnosisItem = {
    code: string;
    description: string;
    date: string;   
};
export type PrescriptionItem = {
    drug: string;
    dose: string;
    route: string;
    frequency: string;
    start_date?: string; 
};
export interface Allergy {
    substance: string;
    reaction: string;
    severity: string;
}
export interface Medication {
    drug: string;
    dose: string;
    route: string;
    frequency: string;
    start_date?: string;
}
export interface Diagnosis {
    code?: string;
    description: string;
    type: DiagnosisType;
}
export interface OrderItem {
    type: OrderType;
    description: string;
    status?: OrderStatus;
}

export interface PatientBasic {
    document_type: string;
    document_number: string;
    first_name: string;
    last_name: string;
    birth_date?: string;
    sex_at_birth?: string;
    contact?: { phone?: string | null; email?: string | null };
}

export interface Vitals {
    bp?: string | null;
    hr?: string | null;
    rr?: string | null;
    temp?: string | null;
    spo2?: string | null;
    weight?: string | null;
    height?: string | null;
    bmi?: number | null;
}

export interface EncounterPayload {
    allergies: any;
    patient: PatientBasic;
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
        vitals: Vitals;
        diagnoses: Diagnosis[];
        prescriptions: Medication[];
        orders: OrderItem[];
    };
    audit: { created_at: string };
}
