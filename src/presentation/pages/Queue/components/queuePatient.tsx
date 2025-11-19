import * as React from "react";
import { Separator } from "@radix-ui/themes";
import { cn } from "../../../../core/utils/cn";
import { Button } from "../../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, ChevronLeft, UserRoundCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";

export type QueuePatientProps = {
    ticketNumber: string | number;
    aheadCount: number;
    etaMinutes: number;
    onBack?: () => void;
    title?: string;
    subtitle?: string;
    doctor?: {
        name: string;
        specialty: string;
        departament: string;
    };
    appointment?: {
        id: string;
        scheduledAt: string;
        status: string;
    };
    lastUpdatedISO?: string;
    className?: string;
};

function humanizeAgo(iso?: string) {
    if (!iso) return null;
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.max(0, Math.round(diff / 60000));
    if (mins < 1) return "justo ahora";
    if (mins === 1) return "hace 1 minuto";
    if (mins < 60) return `hace ${mins} minutos`;
    const h = Math.floor(mins / 60);
    return h === 1 ? "hace 1 hora" : `hace ${h} horas`;
}

export function QueuePatient({
    ticketNumber,
    aheadCount,
    etaMinutes,
    onBack,
    title = "Pronto serás atendido",
    subtitle = "Por favor, espera en la sala de espera.",
    doctor,
    lastUpdatedISO,
    className,
}: QueuePatientProps) {
    const updatedAgo = humanizeAgo(lastUpdatedISO);

    return (
        <Card
            className={cn(
                "w-full max-w-md overflow-hidden border-0 shadow-lg",
                "bg-[radial-gradient(1200px_400px_at_100%_-10%,#EBFFD8_0%,transparent_60%),#F8FAFC]",
                className
            )}
            aria-live="polite"
        >
            <CardHeader className="relative">
                <div className="absolute left-4 top-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        aria-label="Volver"
                        className="rounded-2xl hover:bg-[#C4E1E6]/40"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
                <CardTitle className="text-xl md:text-2xl tracking-tight text-slate-900">
                    {title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                    {subtitle}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="grid gap-5">
                    <div
                        className={
                            "flex items-center justify-between rounded-2xl border p-4 md:p-5 " +
                            "bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50"
                        }
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border bg-[#A4CCD9]/30"
                                aria-hidden
                            >
                                <UserRoundCheck className="h-5 w-5 text-slate-700" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm text-slate-600">Tu turno</p>
                                <AnimatePresence mode="popLayout" initial={false}>
                                    <motion.p
                                        key={String(ticketNumber)}
                                        initial={{ y: 12, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -12, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                        className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900"
                                    >
                                        N° {ticketNumber}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MetricTile
                            icon={<Users className="h-5 w-5" />}
                            label="Pacientes antes que tú"
                            value={aheadCount === 1 ? "1 paciente" : `${aheadCount} pacientes`}
                        />

                        <MetricTile
                            icon={<Clock className="h-5 w-5" />}
                            label="Tiempo estimado de espera"
                            value={
                                etaMinutes <= 1
                                    ? "1 minuto"
                                    : `${etaMinutes.toLocaleString()} minutos`
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>Progreso</span>
                            <span>{aheadCount === 0 ? "¡Estás al turno!" : `Faltan ${aheadCount}`}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, Math.max(0, (100 * 1) / (aheadCount + 1)))}%` }}
                                transition={{ duration: 0.6 }}
                                className="h-full bg-[#8DBCC7]"
                            />
                        </div>


                        <div className="rounded-2xl border border-[#8DBCC7] p-4">
                            <p className="text-sm text-slate-700 font-medium">El doctor </p>
                            <p className="text-sm text-slate-900">{doctor?.name}</p>
                            <p className="text-sm text-slate-600"> pronto te atenderá </p>
                        </div>

                        <div>
                        </div>

                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex-col gap-3">
                {updatedAgo && (
                    <p className="text-xs text-slate-500">Actualizado {updatedAgo}</p>
                )}

                <Separator className="w-full opacity-50" />

                <Button type="button" onClick={onBack} className="w-full rounded-xl bg-[#8DBCC7] hover:bg-[#A4CCD9] text-slate-900">
                    Volver al inicio
                </Button>
            </CardFooter>
        </Card>
    );
}

function MetricTile({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-2xl border bg-white/70 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/50">
            <div className="flex items-center gap-3 text-slate-800">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-[#C4E1E6]/40">
                    {icon}
                </span>
                <div className="min-w-0">
                    <p className="text-xs text-slate-600">{label}</p>
                    <p className="text-base md:text-lg font-medium leading-tight text-slate-900">{value}</p>
                </div>
            </div>
        </div>
    );
}


