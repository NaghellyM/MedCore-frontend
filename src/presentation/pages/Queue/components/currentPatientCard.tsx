import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../../../core/utils/cn";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { PatientNameDisplay } from "../../../components/globals/PatientNameDisplay";
import type { CurrentPatientCardProps } from "../../../../core/types/queue";
import { usePatientDisplay } from "../../../../core/hooks/queue/usePatientDisplay";
import { formatDateTime, getQueueStatusLabel } from "../../../../core/utils/format";
import { usePatientActions } from "../../../../core/hooks/queue/usePatientActions";
import { useRealTimeDuration } from "../../../../core/hooks/queue/useRealTimeDuration";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Clock, CheckCircle, User, Calendar, HeartPlus, Loader2, Stethoscope } from "lucide-react";

export const CurrentPatientCard = memo(function CurrentPatientCard({
    patient,
    onComplete,
    completing = false,
    className,
}: CurrentPatientCardProps) {
    const navigate = useNavigate();
    const realTimeDuration = useRealTimeDuration(patient?.updatedAt || null);
    const { displayState, displayText } = usePatientDisplay(patient?.patientId || null);
    const { handleComplete, canComplete } = usePatientActions({
        onComplete,
        patientId: patient?.id || ''
    });

    // Handler para iniciar consulta
    const handleStartConsultation = () => {
        if (patient) {
            navigate('/consultation', { 
                state: { patient } 
            });
        }
    };

    if (!patient) {
        return (
            <Card className={cn(
                "border-2 border-border bg-card",
                className
            )}>
                <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        No hay ningún paciente en atención actualmente
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn(
            "border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 dark:from-card dark:to-primary/10",
            "shadow-lg dark:shadow-primary/5",
            className
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Paciente en Atención
                    </CardTitle>
                    <Badge
                        variant="default"
                        className={cn(
                            "transition-colors",
                            patient.status === "CALLED" && "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30",
                            patient.status === "IN_PROGRESS" && "bg-primary/20 text-primary dark:text-primary border border-primary/30",
                            patient.status === "WAITING" && "bg-muted text-muted-foreground border border-border"
                        )}
                    >
                        {getQueueStatusLabel(patient.status)}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Información del turno */}
                <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 dark:bg-primary/30">
                            <span className="text-xl font-bold text-primary">
                                N°{patient.queueNumber}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Número de turno</p>
                            <p className="text-sm font-medium text-foreground">
                                Turno {patient.queueNumber}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 dark:bg-secondary/30">
                        <Clock className="h-4 w-4 text-secondary-foreground" />
                        <span className="text-sm font-medium text-secondary-foreground">{realTimeDuration}</span>
                    </div>
                </div>

                {/* Información del paciente */}
                <div className="space-y-3 p-4 bg-card rounded-xl border border-border">
                    <div className="flex items-center gap-3 text-foreground">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                            <HeartPlus className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm">
                            <span className="font-medium text-muted-foreground">ID Cita:</span>{" "}
                            <span className="text-foreground">{patient.appointmentId.slice(-8)}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-foreground">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                            <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm">
                            <span className="font-medium text-muted-foreground">Nombre del Paciente:</span>{" "}
                            <PatientNameDisplay 
                                displayState={displayState} 
                                displayText={displayText}
                                className="text-foreground"
                            />
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-foreground">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm">
                            <span className="font-medium text-muted-foreground">Fecha y hora de atención:</span>{" "}
                            <span className="text-foreground">{formatDateTime(patient.updatedAt)}</span>
                        </span>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="pt-2 space-y-3">
                    {/* Botón de iniciar consulta */}
                    <Button
                        onClick={handleStartConsultation}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-md hover:shadow-lg"
                        size="lg"
                        aria-label="Iniciar consulta médica"
                    >
                        <Stethoscope className="h-5 w-5 mr-2" />
                        Iniciar Consulta
                    </Button>

                    {/* Botón de completar atención (rápido) */}
                    <Button
                        onClick={handleComplete}
                        disabled={completing || !canComplete}
                        variant="outline"
                        className="w-full border-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                                Marcar como Atendido (Rápido)
                            </>
                        )}
                    </Button>
                </div>

                {/* Nota informativa */}
                <div className="p-3 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-xl">
                    <p className="text-xs text-primary dark:text-primary/90 text-center">
                        💡 Usa <strong>"Iniciar Consulta"</strong> para acceder a la historia clínica, 
                        diagnósticos y prescripciones del paciente.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
});