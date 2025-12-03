/**
 * VISTA DE SOLO LECTURA DE DIAGNÓSTICO
 * ====================================
 * Componente responsable de mostrar información del diagnóstico
 */

import type { Diagnostic } from "../../../../core/types/medicalHistory";

interface DiagnosticReadViewProps {
    diagnostic: Diagnostic;
}

interface DataFieldProps {
    label: string;
    value: string;
    secondary?: boolean;
}

function DataField({ label, value, secondary = false }: DataFieldProps) {
    return (
        <div>
            <span className="font-medium text-muted-foreground">{label}:</span>
            <p className={`mt-1 text-sm ${secondary ? 'text-muted-foreground' : 'text-foreground'}`}>
                {value}
            </p>
        </div>
    );
}

export function DiagnosticReadView({ diagnostic }: DiagnosticReadViewProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <DataField label="Título" value={diagnostic.title} />
                <DataField label="Fecha" value={formatDate(diagnostic.consultDate)} />
            </div>

            {diagnostic.description && (
                <DataField label="Descripción" value={diagnostic.description} />
            )}

            {diagnostic.symptoms && (
                <DataField label="Síntomas" value={diagnostic.symptoms} />
            )}

            {diagnostic.diagnosis && (
                <DataField label="Diagnóstico" value={diagnostic.diagnosis} />
            )}

            {diagnostic.treatment && (
                <DataField label="Tratamiento" value={diagnostic.treatment} />
            )}

            {diagnostic.observations && (
                <DataField label="Observaciones" value={diagnostic.observations} secondary />
            )}

            {diagnostic.nextAppointment && (
                <DataField label="Próxima Cita" value={formatDate(diagnostic.nextAppointment)} />
            )}
        </div>
    );
}
