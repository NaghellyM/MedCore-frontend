import { QueuePatient } from "../components/queuePatient";
import { useQueuePosition } from "../../../../core//hooks/useQueuePosition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";


export type QueuePatientContainerProps = {
    ticketId: string;
    onBack?: () => void;
    pollMs?: number;
    enableLocalCountdown?: boolean;
};

export function QueuePatientContainer({
    ticketId,
    onBack,
    pollMs = 10000,
    enableLocalCountdown = true,
}: QueuePatientContainerProps) {
    const { loading, error, derived, refetch, lastUpdatedISO } = useQueuePosition(ticketId, {
        pollMs,
        enableLocalCountdown,
    });

    if (loading) {
        return (
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">Obteniendo tu turno…</CardTitle>
                    <CardDescription className="text-slate-600">Por favor, espera un momento.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="h-24 w-full rounded-2xl bg-slate-100 animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                        <div className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !derived) {
        return (
            <Card className="w-full max-w-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">No pudimos cargar tu turno</CardTitle>
                    <CardDescription className="text-slate-600">
                        {error ?? "Intenta nuevamente o vuelve más tarde."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex items-center gap-2">
                    <Button onClick={refetch}>Reintentar</Button>
                    {onBack && (
                        <Button variant="ghost" onClick={onBack}>
                            Volver
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    const titleByStatus: Record<string, string> = {
        WAITING: "Pronto serás atendido",
        IN_PROGRESS: "Estás por ingresar",
        COMPLETED: "Turno finalizado",
        CANCELLED: "Turno cancelado",
    };
    const title = titleByStatus[derived.status] ?? "Pronto serás atendido";
    const subtitle =
        derived.aheadCount === 0
            ? "Estás a punto de ser llamado, por favor permanece cerca."
            : "Por favor, espera en la sala de espera.";

    return (
        <QueuePatient
            ticketNumber={derived.ticketNumber}
            aheadCount={derived.aheadCount}
            etaMinutes={derived.etaMinutes}
            lastUpdatedISO={lastUpdatedISO}
            title={title}
            subtitle={subtitle}
            onBack={onBack}
        />
    );
}
