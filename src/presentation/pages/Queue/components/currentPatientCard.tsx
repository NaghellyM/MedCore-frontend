import { memo } from "react";
import { cn } from "../../../../core/utils/cn";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { PatientNameDisplay } from "../../../components/ui/PatientNameDisplay";
import type { CurrentPatientCardProps } from "../../../../core/types/queue";
import { usePatientDisplay } from "../../../../core/hooks/queue/usePatientDisplay";
import { formatDateTime, getQueueStatusLabel } from "../../../../core/utils/format";
import { usePatientActions } from "../../../../core/hooks/queue/usePatientActions";
import { useRealTimeDuration } from "../../../../core/hooks/queue/useRealTimeDuration";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Clock, CheckCircle, User, Calendar, HeartPlus, Loader2 } from "lucide-react";

export const CurrentPatientCard = memo(function CurrentPatientCard({
    patient,
    onComplete,
    completing = false,
    className,
}: CurrentPatientCardProps) {
    const realTimeDuration = useRealTimeDuration(patient?.updatedAt || null);
    const { displayState, displayText } = usePatientDisplay(patient?.patientId || null);
    const { handleComplete, canComplete } = usePatientActions({
        onComplete,
        patientId: patient?.id || ''
    });

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
                        className={cn(
                            "text-slate-900 transition-colors",
                            patient.status === "CALLED" && "bg-amber-200 hover:bg-amber-300",
                            patient.status === "IN_PROGRESS" && "bg-[#8DBCC7] hover:bg-[#A4CCD9]",
                            patient.status === "WAITING" && "bg-slate-200 hover:bg-slate-300"
                        )}
                    >
                        {getQueueStatusLabel(patient.status)}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Información del turno */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#8DBCC7]/30">
                            <span className="text-xl font-bold text-slate-900">
                                N°{patient.queueNumber}
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
                        <span className="text-sm font-medium">{realTimeDuration}</span>
                    </div>
                </div>

                {/* Información del paciente */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                        <HeartPlus className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                            <span className="font-medium">ID Cita:</span>{" "}
                            {patient.appointmentId.slice(-8)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                            <span className="font-medium">Nombre del Paciente:</span>{" "}
                            <PatientNameDisplay 
                                displayState={displayState} 
                                displayText={displayText} 
                            />
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm">
                            <span className="font-medium">Fecha y hora de atención:</span>{" "}
                            {formatDateTime(patient.updatedAt)}
                        </span>
                    </div>
                </div>

                {/* Botón de completar */}
                <div className="pt-2">
                    <Button
                        onClick={handleComplete}
                        disabled={completing || !canComplete}
                        className="w-full bg-[#647FBC] hover:bg-[#8DBCC7] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        size="lg"
                        aria-label={completing ? "Completando atención del paciente" : "Marcar paciente como atendido"}
                    >
                        {completing ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Completando atención...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Paciente Atendido
                            </>
                        )}
                    </Button>
                </div>

                {/* Nota informativa */}
                <div className="p-3 bg-[#FAFDD6]/50 border border-[#e6c4c4] rounded-lg">
                    <p className="text-xs text-slate-600 text-center">
                        Por favor, completa la atención de este paciente antes de llamar al siguiente.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});