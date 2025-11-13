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
    const {
        loading,
        error,
        items,
        totalsByStatus,
        lastUpdatedISO,
        refetch,
        callNext,
        callingNext,
        nextUp,
        currentPatient,
        completeAttention,
        completing,
    } = useDoctorCurrentQueue(doctorId, { pollMs });

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

    const canCallNext = (totalsByStatus["WAITING"] ?? 0) > 0 && !callingNext && !currentPatient;

    const handleCallNext = async () => {
        try {
            console.log('Calling next patient for doctorId:', doctorId);
            console.log('Current waiting patients:', totalsByStatus["WAITING"]);
            console.log('Next up:', nextUp);
            console.log('Current patient:', currentPatient);

            if (!canCallNext) {
                console.warn('Cannot call next: no waiting patients, already calling, or patient in attention');
                return;
            }

            const called = await callNext();
            console.log('Successfully called patient:', called);

        } catch (e: any) {
            console.error('Error calling next patient:', e);
            console.error('Error details:', {
                message: e.message,
                response: e.response?.data,
                status: e.response?.status,
                doctorId
            });
            
        }
    };

    const handleCompleteAttention = async (appointmentId: string) => {
        try {
            await completeAttention(appointmentId);

        } catch (e: any) {
            console.error('Error completing attention:', e);
            console.error('Error details:', {
                message: e.message,
                response: e.response?.data,
                status: e.response?.status,
                appointmentId
            });
            ;
        }
    };

    return (
        <DoctorQueue
            className={className}
            items={items.map((i) => ({
                id: i.id,
                queueNumber: i.queueNumber,
                patientId: i.patientId,
                appointmentId: i.appointmentId,
                status: i.status,
                createdAt: i.createdAt,
                updatedAt: i.updatedAt,
            }))}
            totalsByStatus={totalsByStatus}
            lastUpdatedISO={lastUpdatedISO}
            onRefresh={refetch}
            title="Cola actual del doctor"
            onCallNext={handleCallNext}
            callingNext={callingNext}
            canCallNext={canCallNext}
            nextUp={nextUp ? { queueNumber: nextUp.queueNumber, patientId: nextUp.patientId } : null}
            currentPatient={currentPatient ? {
                id: currentPatient.id,
                queueNumber: currentPatient.queueNumber,
                patientId: currentPatient.patientId,
                appointmentId: currentPatient.appointmentId,
                status: currentPatient.status,
                createdAt: currentPatient.createdAt,
                updatedAt: currentPatient.updatedAt,
            } : null}
            onCompleteAttention={handleCompleteAttention}
            completing={completing}
            onBack={onBack}
        />
    );
}