export interface Patient {
    id: string;
    fullname: string;
    identificacion: string;
    email?: string;
    role?: string;
    phone?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PatientBasicInfo {
    id: string;
    fullname: string;
}

export type GetPatientResponse = Patient;