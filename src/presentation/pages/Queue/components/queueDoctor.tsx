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
        <li className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground">
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
                <span className="text-xs text-muted-foreground">#{index + 1}</span>
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
            <Card className="border border-border shadow-lg bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {onBack && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onBack}
                                    aria-label="Volver"
                                    className="rounded-2xl hover:bg-muted"
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
                        <div className="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-foreground">
                                            Siguiente: #{nextUp.queueNumber}
                                        </span>
                                    </div>
                                    <NextUpPatientDisplay patientId={nextUp.patientId} />
                                </div>
                                <Button
                                    onClick={onCallNext}
                                    disabled={!canCallNext || callingNext}
                                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
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
                        "mt-4 p-4 rounded-lg border",
                        isPaused 
                            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700" 
                            : "bg-muted border-border"
                    )}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isPaused ? (
                                    <>
                                        <Pause className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                                            Atención pausada
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 text-muted-foreground" />
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
                                    isPaused 
                                        ? "bg-green-600 hover:bg-green-700 text-white" 
                                        : "border-yellow-400 text-yellow-700 hover:bg-yellow-50"
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
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
                                ⚠️ No se llamarán nuevos pacientes mientras la atención esté pausada
                            </p>
                        )}
                    </div>

                    {!nextUp && totalsByStatus["WAITING"] === 0 && !currentPatient && (
                        <div className="mt-4 p-4 rounded-lg bg-muted border border-border">
                            <p className="text-sm text-muted-foreground text-center">
                                No hay pacientes en espera
                            </p>
                        </div>
                    )}

                    {currentPatient && nextUp && (
                        <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                            <p className="text-xs text-amber-800 dark:text-amber-300 text-center">
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
        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-foreground bg-muted">
            {label}: <strong className="font-medium">{value}</strong>
        </span>
    );
}

