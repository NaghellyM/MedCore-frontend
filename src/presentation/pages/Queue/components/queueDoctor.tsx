import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "@radix-ui/themes";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../../core/utils/cn";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, SkipForward, Users, Clock, Play, Pause } from "lucide-react";
import { CurrentPatientCard } from "./currentPatientCard";
import { PatientNameDisplay } from "../../../components/globals/PatientNameDisplay";
import { humanizeAgo, queueStatusToLabel, queueStatusToVariant } from "../../../../core/utils/format";
import { usePatientDisplay } from "../../../../core/hooks/queue/usePatientDisplay";
import type { QueuePatient, QueueItemDTO } from "../../../../core/types/queue";

const QueuePatientItem = ({ item, index }: { item: QueueItemDTO; index: number }) => {
    const { displayState, displayText } = usePatientDisplay(item.patientId);

    return (
        <li className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted text-foreground font-semibold text-sm">
                    N°{item.queueNumber}
                </span>
                <div className="min-w-0">
                    <PatientNameDisplay
                        displayState={displayState}
                        displayText={displayText}
                        className="text-sm font-medium text-foreground"
                    />
                    <p className="text-xs text-muted-foreground">
                        Creado: {new Date(item.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Badge variant={queueStatusToVariant(item.status)}>{queueStatusToLabel(item.status)}</Badge>
                <span className="text-xs text-muted-foreground font-medium">#{index + 1}</span>
            </div>
        </li>
    );
};

const NextUpPatientDisplay = ({ patientId }: { patientId: string }) => {
    const { displayState, displayText } = usePatientDisplay(patientId);

    return (
        <span className="text-xs text-muted-foreground">
            {displayState === 'success' ? displayText : `Paciente ${patientId.slice(-4)}`}
        </span>
    );
};

export type DoctorQueueProps = {
    items: QueueItemDTO[];
    totalsByStatus: Record<string, number>;
    lastUpdatedISO?: string;
    onRefresh?: () => void;
    className?: string;
    title?: string;
    onBack?: () => void;
    onCallNext?: () => void;
    callingNext?: boolean;
    canCallNext?: boolean;
    canPauseAttention?: boolean;
    onPauseAttention?: () => void;
    pausing?: boolean;
    isPaused?: boolean;
    nextUp?: { queueNumber: number, patientId: string } | null;
    currentPatient?: QueuePatient | null;
    onCompleteAttention?: (appointmentId: string) => void;
    completing?: boolean;
};

export function DoctorQueue({
    items,
    totalsByStatus,
    lastUpdatedISO,
    className,
    title,
    onBack,
    onCallNext,
    callingNext,
    canCallNext,
    canPauseAttention,
    onPauseAttention,
    pausing,
    isPaused,
    nextUp,
    currentPatient,
    onCompleteAttention,
    completing,
}: DoctorQueueProps) {
    const updatedText = humanizeAgo(lastUpdatedISO);

    return (
        <div className={cn("w-full max-w-4xl space-y-4", className)}>
            {/* Tarjeta de paciente en atención */}
            {currentPatient && (
                <CurrentPatientCard
                    patient={currentPatient}
                    onComplete={onCompleteAttention}
                    completing={completing}
                />
            )}

            {/* Tarjeta principal de la cola */}
            <Card className="border border-border shadow-lg bg-card dark:shadow-none dark:border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {onBack && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onBack}
                                    aria-label="Volver"
                                    className="rounded-xl hover:bg-muted"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            )}
                            <CardTitle className="text-foreground">{title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusPill label="En espera" value={totalsByStatus["WAITING"] ?? 0} />
                        </div>
                    </div>

                    {/* Sección para llamar al siguiente paciente */}
                    {nextUp && !currentPatient && (
                        <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                            Siguiente: #{nextUp.queueNumber}
                                        </span>
                                    </div>
                                    <NextUpPatientDisplay patientId={nextUp.patientId} />
                                </div>
                                <Button
                                    onClick={onCallNext}
                                    disabled={!canCallNext || callingNext}
                                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white disabled:opacity-50 shadow-md hover:shadow-lg transition-all"
                                    size="sm"
                                >
                                    {callingNext ? (
                                        <>
                                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                                            Llamando...
                                        </>
                                    ) : (
                                        <>
                                            <SkipForward className="h-4 w-4 mr-2" />
                                            Llamar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Botón de Pausar/Reanudar atención */}
                    <div className={cn(
                        "mt-4 p-4 rounded-xl border transition-colors",
                        isPaused 
                            ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50" 
                            : "bg-muted/50 dark:bg-muted/30 border-border"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isPaused ? (
                                    <>
                                        <Pause className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                            Atención pausada
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-sm text-muted-foreground">
                                            Atención activa
                                        </span>
                                    </>
                                )}
                            </div>
                            <Button
                                onClick={onPauseAttention}
                                disabled={!canPauseAttention || pausing}
                                variant={isPaused ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "transition-all",
                                    isPaused 
                                        ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white" 
                                        : "border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50"
                                )}
                            >
                                {pausing ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                                        {isPaused ? "Reanudando..." : "Pausando..."}
                                    </>
                                ) : isPaused ? (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Reanudar atención
                                    </>
                                ) : (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pausar atención
                                    </>
                                )}
                            </Button>
                        </div>
                        {isPaused && (
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                                ⚠️ No se llamarán nuevos pacientes mientras la atención esté pausada
                            </p>
                        )}
                    </div>

                    {!nextUp && totalsByStatus["WAITING"] === 0 && !currentPatient && (
                        <div className="mt-4 p-4 rounded-xl bg-muted/50 dark:bg-muted/30 border border-border">
                            <p className="text-sm text-muted-foreground text-center">
                                No hay pacientes en espera
                            </p>
                        </div>
                    )}

                    {currentPatient && nextUp && (
                        <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50">
                            <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
                                ⚠️ Completa la atención del paciente actual antes de llamar al siguiente
                            </p>
                        </div>
                    )}

                    {updatedText && <p className="text-xs text-muted-foreground mt-2">{updatedText}</p>}
                </CardHeader>

                <CardContent className="p-0">
                    <Separator className="opacity-50" />
                    <ul className="divide-y divide-border">
                        {items.length === 0 && (
                            <li className="p-4 text-sm text-muted-foreground">No hay pacientes en espera.</li>
                        )}

                        {items.map((it, idx) => (
                            <QueuePatientItem key={it.id} item={it} index={idx} />
                        ))}
                    </ul>
                </CardContent>

                <CardFooter className="flex-col gap-3">
                    <Separator className="w-full opacity-50" />
                    {updatedText && (
                        <p className="text-xs text-muted-foreground">{updatedText}</p>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

function StatusPill({ label, value }: { label: string; value: number }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 dark:border-primary/40 px-3 py-1 text-xs font-medium text-primary bg-primary/10 dark:bg-primary/20">
            {label}: <strong className="font-semibold">{value}</strong>
        </span>
    );
}

