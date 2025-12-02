import * as React from "react";
import { cn } from "../../../../core/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, UserRoundCheck, Stethoscope, CalendarClock, CheckCircle2 } from "lucide-react";

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
    title = "Tu turno en la cola",
    subtitle = "Mantente cerca, pronto serás llamado.",
    doctor,
    lastUpdatedISO,
    className,
}: QueuePatientProps) {
    const updatedAgo = humanizeAgo(lastUpdatedISO);
    const isNextUp = aheadCount === 0;
    const progressPercent = Math.min(100, Math.max(5, (100 * 1) / (aheadCount + 1)));

    return (
        <div
            className={cn(
                "w-full max-w-lg overflow-hidden rounded-3xl",
                "bg-card border border-border shadow-2xl",
                "transition-all duration-300",
                className
            )}
            aria-live="polite"
        >
            {/* Header con gradiente usando colores del sistema */}
            <div className={cn(
                "relative px-6 py-8 text-center",
                isNextUp 
                    ? "bg-gradient-to-br from-success/90 to-success" 
                    : "bg-gradient-to-br from-primary/90 to-primary"
            )}>
                {/* Decoración de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/20" />
                    <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white/10" />
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                        {isNextUp ? (
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        ) : (
                            <CalendarClock className="w-8 h-8 text-white" />
                        )}
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {isNextUp ? "¡Es tu turno!" : title}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                        {isNextUp ? "El doctor te está esperando" : subtitle}
                    </p>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="p-6 space-y-6">
                {/* Número de turno destacado */}
                <div className="relative">
                    <div className={cn(
                        "flex items-center justify-center gap-4 p-6 rounded-2xl border-2",
                        isNextUp 
                            ? "bg-success-light border-success/30"
                            : "bg-primary/5 dark:bg-primary/10 border-primary/30"
                    )}>
                        <div className={cn(
                            "flex items-center justify-center w-14 h-14 rounded-xl",
                            isNextUp 
                                ? "bg-success/20" 
                                : "bg-primary/20"
                        )}>
                            <UserRoundCheck className={cn(
                                "w-7 h-7",
                                isNextUp ? "text-success" : "text-primary"
                            )} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm text-muted-foreground font-medium">Tu número de turno</p>
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.p
                                    key={String(ticketNumber)}
                                    initial={{ y: 12, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -12, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                                    className={cn(
                                        "text-4xl md:text-5xl font-bold tracking-tight",
                                        isNextUp ? "text-success" : "text-primary"
                                    )}
                                >
                                    #{ticketNumber}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                        icon={<Users className="w-5 h-5" />}
                        label="Pacientes antes"
                        value={aheadCount}
                        suffix={aheadCount === 1 ? "persona" : "personas"}
                        highlight={aheadCount === 0}
                        highlightType="success"
                    />
                    <MetricCard
                        icon={<Clock className="w-5 h-5" />}
                        label="Tiempo estimado"
                        value={etaMinutes}
                        suffix={etaMinutes === 1 ? "minuto" : "minutos"}
                        highlight={etaMinutes <= 5}
                        highlightType="warning"
                    />
                </div>

                {/* Barra de progreso */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Progreso en la cola</span>
                        <span className={cn(
                            "font-semibold",
                            isNextUp ? "text-success" : "text-foreground"
                        )}>
                            {isNextUp ? "¡Estás al frente!" : `${Math.round(progressPercent)}%`}
                        </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={cn(
                                "h-full rounded-full",
                                isNextUp 
                                    ? "bg-gradient-to-r from-success to-success/80" 
                                    : "bg-gradient-to-r from-primary to-secondary"
                            )}
                        />
                    </div>
                </div>

                {/* Info del doctor */}
                {doctor && (
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent">
                                <Stethoscope className="w-6 h-6 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-muted-foreground">Tu doctor</p>
                                <p className="font-semibold text-foreground truncate">
                                    Dr. {doctor.name}
                                </p>
                                {doctor.specialty && (
                                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Última actualización */}
                {updatedAgo && (
                    <p className="text-center text-xs text-muted-foreground">
                        Actualizado {updatedAgo}
                    </p>
                )}

            </div>
        </div>
    );
}

function MetricCard({
    icon,
    label,
    value,
    suffix,
    highlight = false,
    highlightType = "success",
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    suffix?: string;
    highlight?: boolean;
    highlightType?: "success" | "warning";
}) {
    const colors = {
        success: {
            bg: "bg-success-light",
            border: "border-success/30",
            icon: "bg-success/20 text-success",
            value: "text-success",
        },
        warning: {
            bg: "bg-warning-light",
            border: "border-warning/30",
            icon: "bg-warning/20 text-warning",
            value: "text-warning",
        },
    };

    const colorSet = highlight ? colors[highlightType] : {
        bg: "bg-muted/50",
        border: "border-border",
        icon: "bg-muted text-muted-foreground",
        value: "text-foreground",
    };

    return (
        <div className={cn(
            "p-4 rounded-2xl border transition-all",
            colorSet.bg,
            colorSet.border
        )}>
            <div className="flex items-center gap-3">
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-xl",
                    colorSet.icon
                )}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground truncate">{label}</p>
                    <p className={cn("text-2xl font-bold", colorSet.value)}>
                        {value}
                    </p>
                    {suffix && (
                        <p className="text-xs text-muted-foreground">{suffix}</p>
                    )}
                </div>
            </div>
        </div>
    );
}


