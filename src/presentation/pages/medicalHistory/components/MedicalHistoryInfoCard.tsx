/**
 * TARJETA DE INFORMACIÓN DE HISTORIA CLÍNICA
 * ==========================================
 * Componente responsable de mostrar información básica de la historia
 */

import { User, Calendar, Stethoscope, FileText } from "lucide-react";
import type { MedicalHistory } from "../../../../core/types/medicalHistory";

interface MedicalHistoryInfoCardProps {
    medicalHistory: MedicalHistory;
    patientName: string;
}

interface InfoFieldProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

function InfoField({ icon, label, value }: InfoFieldProps) {
    return (
        <div className="flex items-start gap-3 p-4 bg-muted/30 dark:bg-muted/20 rounded-lg transition-colors duration-300">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                {icon}
            </div>
            <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    {label}
                </label>
                <div className="text-base font-semibold text-foreground">{value}</div>
            </div>
        </div>
    );
}

export function MedicalHistoryInfoCard({ medicalHistory, patientName }: MedicalHistoryInfoCardProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b border-border">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Editar Historia Clínica
                </h2>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoField
                        icon={<User className="h-5 w-5 text-primary" />}
                        label="Paciente"
                        value={patientName}
                    />
                    
                    <InfoField
                        icon={<Stethoscope className="h-5 w-5 text-primary" />}
                        label="Médico Tratante"
                        value={`Dr. ${medicalHistory.doctor.fullname}`}
                    />
                    
                    <InfoField
                        icon={<Calendar className="h-5 w-5 text-primary" />}
                        label="Fecha de Creación"
                        value={formatDate(medicalHistory.createdAt)}
                    />
                    
                    <InfoField
                        icon={<Calendar className="h-5 w-5 text-primary" />}
                        label="Última Actualización"
                        value={formatDate(medicalHistory.updatedAt)}
                    />
                </div>
            </div>
        </div>
    );
}
