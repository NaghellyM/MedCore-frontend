import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Clock, CheckCircle, User, Calendar, Phone } from "lucide-react";
import { cn } from "../../../../core/utils/cn";

export type CurrentPatientCardProps = {
    patient: {
        id: string;
        queueNumber: number;
        patientId: string;
        appointmentId: string;
        status: string;
        createdAt: string;
        updatedAt: string;
    } | null;
    onComplete?: (queueItemId: string) => void; 
    completing?: boolean;
    className?: string;
};

function formatDateTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTimeDuration(startTime: string) {
    const start = new Date(startTime).getTime();
    const now = Date.now();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Menos de 1 minuto";
    if (diffMins === 1) return "1 minuto";
    if (diffMins < 60) return `${diffMins} minutos`;

    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
}

export function CurrentPatientCard({
    patient,
    onComplete,
    completing = false,
    className,
}: CurrentPatientCardProps) {
    if (!patient) {
        return (
            <Card className={cn("border-2 border-slate-200", className)}>
                <CardContent className="p-6 text-center">
                    <p className="text-sm text-slate-600">
                        No hay ningún paciente en atención actualmente
                    </p>
                </CardContent>
            </Card>
        );
    }

    const duration = getTimeDuration(patient.updatedAt);

    const handleComplete = () => {
        if (onComplete) {
            onComplete(patient.id);
        } else {
            console.warn('⚠️ onComplete function is not provided');
        }
    };

    return (
        <Card className={cn(
            "border-2 border-[#8DBCC7] bg-gradient-to-br from-white to-[#EBFFD8]/20",
            className
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                        Paciente en Atención
                    </CardTitle>
                    <Badge
                        variant="default"
                        className="bg-[#8DBCC7] text-slate-900 hover:bg-[#A4CCD9]"
                    >
                        {patient.status === "CALLED" ? "Llamado" : "En Curso"}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Información del turno */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#8DBCC7]/30">
                            <span className="text-xl font-bold text-slate-900">
                                #{patient.queueNumber}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Número de turno</p>
                            <p className="text-sm font-medium text-slate-900">
                                Turno {patient.queueNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#647FBC]">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{duration}</span>
                    </div>
                </div>

                {/* Información del paciente */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                            <span className="font-medium">ID Paciente:</span>{" "}
                            {patient.patientId.slice(-8)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                            <span className="font-medium">ID Cita:</span>{" "}
                            {patient.appointmentId.slice(-8)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                            <span className="font-medium">Llamado:</span>{" "}
                            {formatDateTime(patient.updatedAt)}
                        </span>
                    </div>

                    {/* DEBUG INFO - Remover en producción */}
                    <div className="p-2 bg-slate-50 rounded text-xs text-slate-500 font-mono">
                        <div>Queue Item ID: {patient.id.slice(-12)}</div>
                        <div>Appointment ID: {patient.appointmentId.slice(-12)}</div>
                    </div>
                </div>

                {/* Botón de completar */}
                <div className="pt-2">
                    <Button
                        onClick={handleComplete}
                        disabled={completing}
                        className="w-full bg-[#647FBC] hover:bg-[#8DBCC7] text-white disabled:opacity-50"
                        size="lg"
                    >
                        {completing ? (
                            <>
                                <Clock className="h-5 w-5 mr-2 animate-spin" />
                                Completando atención...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Completar Atención
                            </>
                        )}
                    </Button>
                </div>

                {/* Nota informativa */}
                <div className="p-3 bg-[#FAFDD6]/50 border border-[#C4E1E6] rounded-lg">
                    <p className="text-xs text-slate-600 text-center">
                        Completa la atención de este paciente antes de llamar al siguiente
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}