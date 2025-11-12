import { useDoctorCurrentQueue } from "../../../../core/hooks/queue/useDoctorCurrentQueue";
import { DoctorQueue } from "../components/queueDoctor";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export type QueueDoctorContainerProps = {
    doctorId: string;
    onBack?: () => void;
    pollMs?: number;
    className?: string;
};

export function DoctorQueueContainer({
    doctorId,
    onBack,
    pollMs = 15000,
    className,
}: QueueDoctorContainerProps) {
    const { loading, error, items, totalsByStatus, lastUpdatedISO, refetch } =
        useDoctorCurrentQueue(doctorId, { pollMs });

    if (loading) {
        return (
            <Card className="w-full max-w-2xl border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">Cargando cola…</CardTitle>
                    <CardDescription className="text-slate-600">
                        Obteniendo información del doctor.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                    <div className="h-10 w-1/3 bg-slate-100 rounded animate-pulse" />
                    <div className="h-16 w-full bg-slate-100 rounded animate-pulse" />
                    <div className="h-16 w-full bg-slate-100 rounded animate-pulse" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-2xl border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-slate-900">
                        No pudimos cargar la cola
                    </CardTitle>
                    <CardDescription className="text-slate-600">{error}</CardDescription>
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

    return (
        <DoctorQueue
            className={className}
            items={items.map((i) => ({
                id: i.id,
                queueNumber: i.queueNumber,
                patientId: i.patientId,
                status: i.status,
                createdAt: i.createdAt,
            }))}
            totalsByStatus={totalsByStatus}
            lastUpdatedISO={lastUpdatedISO}
            onRefresh={refetch}
            title="Cola actual del doctor"
            onBack={onBack}
        />
    );
}
