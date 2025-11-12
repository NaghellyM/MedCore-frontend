import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Separator } from "@radix-ui/themes";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../../core/utils/cn";
import { Button } from "../../../components/ui/button";

export type DoctorQueueProps = {
    items: Array<{
        id: string;
        queueNumber: number;
        patientId: string;
        status: string;
        createdAt: string;
    }>;
    totalsByStatus: Record<string, number>;
    lastUpdatedISO?: string;
    onRefresh?: () => void;
    className?: string;
    title?: string;
    onBack?: () => void;
};

function humanizeAgo(iso?: string) {
    if (!iso) return null;
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.max(0, Math.round(diff / 60000));
    if (mins < 1) return "actualizado justo ahora";
    if (mins === 1) return "actualizado hace 1 minuto";
    if (mins < 60) return `actualizado hace ${mins} minutos`;
    const h = Math.floor(mins / 60);
    return h === 1 ? "actualizado hace 1 hora" : `actualizado hace ${h} horas`;
}

export function DoctorQueue({
    items,
    totalsByStatus,
    lastUpdatedISO,
    className,
    title = "Cola de espera",
    onBack,
}: DoctorQueueProps) {
    const updatedText = humanizeAgo(lastUpdatedISO);

    return (
        <Card className={cn("w-full max-w-2xl border-0 shadow-lg", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-900">{title}</CardTitle>
                    <div className="flex items-center gap-2">
                        <StatusPill label="En espera" value={totalsByStatus["WAITING"] ?? 0} />
                        <StatusPill label="En curso" value={totalsByStatus["IN_PROGRESS"] ?? 0} />
                        <StatusPill label="Hechos" value={totalsByStatus["COMPLETED"] ?? 0} />
                    </div>
                </div>
                {updatedText && <p className="text-xs text-slate-500">{updatedText}</p>}
            </CardHeader>

            <CardContent className="p-0">
                <Separator className="opacity-50" />
                <ul className="divide-y">
                    {items.length === 0 && (
                        <li className="p-4 text-sm text-slate-600">No hay pacientes en la cola.</li>
                    )}

                    {items.map((it, idx) => (
                        <li key={it.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white">
                                    #{it.queueNumber}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900">
                                        Paciente {it.patientId.slice(-4)} {/* anonimizado */}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        Creado: {new Date(it.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Badge variant={statusToVariant(it.status)}>{statusToLabel(it.status)}</Badge>
                                <span className="text-xs text-slate-500">#{idx + 1}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="flex-col gap-3">
                {updatedText && (
                    <p className="text-xs text-slate-500">{updatedText}</p>
                )}
                <Separator className="w-full opacity-50" />
                <Button type="button" onClick={onBack} className="w-full rounded-xl bg-[#8DBCC7] hover:bg-[#A4CCD9] text-slate-900">
                    Volver al inicio
                </Button>
            </CardFooter>
        </Card>
    );
}

function StatusPill({ label, value }: { label: string; value: number }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs text-slate-700 bg-[#8DBCC7]/20">
            {label}: <strong className="font-medium">{value}</strong>
        </span>
    );
}

function statusToLabel(s: string) {
    switch (s) {
        case "WAITING": return "En espera";
        case "IN_PROGRESS": return "En curso";
        case "COMPLETED": return "Completado";
        case "CANCELLED": return "Cancelado";
        default: return s;
    }
}

function statusToVariant(s: string): "default" | "secondary" | "destructive" | "outline" {
    switch (s) {
        case "WAITING": return "secondary";
        case "IN_PROGRESS": return "default";
        case "COMPLETED": return "outline";
        case "CANCELLED": return "destructive";
        default: return "secondary";
    }
}
