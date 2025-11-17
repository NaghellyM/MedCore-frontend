/**
 * MENSAJES DE ESTADO DEL FORMULARIO
 * =================================
 * Componente especializado para mostrar mensajes de estado, progreso y notificaciones
 * Reutilizable en múltiples formularios del sistema
 */

import { CheckCircle, AlertCircle, Loader2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export type MessageType = "success" | "error" | "info" | "warning" | null;

interface StatusMessage {
    type: MessageType;
    text: string;
    details?: string;
    timestamp?: number;
    persistent?: boolean;
}

interface OrchestrationProgress {
    isActive: boolean;
    currentStep: string;
    state: string;
    progress?: {
        current: number;
        total: number;
    };
}

interface FormStatusMessagesProps {
    // Mensajes principales
    statusMessage?: StatusMessage;
    
    // Progreso de orquestación
    orchestrationProgress?: OrchestrationProgress;
    
    // Configuración
    autoHideDelay?: number; // ms para auto-ocultar mensajes no persistentes
    showTimestamp?: boolean;
    allowDismiss?: boolean;
    
    // Callbacks
    onMessageDismiss?: () => void;
    onMessageExpire?: () => void;
}

/**
 * Componente reutilizable para mostrar estados y mensajes en formularios
 * Maneja mensajes de éxito, error, info y progreso de procesos largos
 */
export function FormStatusMessages({
    statusMessage,
    orchestrationProgress,
    autoHideDelay = 5000,
    showTimestamp = false,
    allowDismiss = true,
    onMessageDismiss,
    onMessageExpire
}: FormStatusMessagesProps) {

    // ========================================================================
    // STATE
    // ========================================================================

    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // ========================================================================
    // EFFECTS
    // ========================================================================

    // Auto-hide para mensajes no persistentes
    useEffect(() => {
        if (statusMessage && 
            !statusMessage.persistent && 
            statusMessage.type !== "info" && 
            autoHideDelay > 0) {
            
            setTimeLeft(autoHideDelay / 1000);
            
            const interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(interval);
                        setIsVisible(false);
                        onMessageExpire?.();
                        return null;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [statusMessage, autoHideDelay, onMessageExpire]);

    // Reset visibilidad cuando cambia el mensaje
    useEffect(() => {
        setIsVisible(true);
        setTimeLeft(null);
    }, [statusMessage?.text, statusMessage?.type]);

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    const hasStatusMessage = statusMessage && statusMessage.type && isVisible;
    const hasOrchestrationProgress = orchestrationProgress?.isActive;

    // ========================================================================
    // HELPERS
    // ========================================================================

    const getMessageIcon = (type: MessageType) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />;
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />;
            case "info":
            default:
                return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
        }
    };

    const getMessageClasses = (type: MessageType) => {
        const baseClasses = "rounded-lg p-4 flex items-start gap-3 relative";
        
        switch (type) {
            case "success":
                return `${baseClasses} bg-green-50 border border-green-200 text-green-800`;
            case "error":
                return `${baseClasses} bg-red-50 border border-red-200 text-red-800`;
            case "warning":
                return `${baseClasses} bg-yellow-50 border border-yellow-200 text-yellow-800`;
            case "info":
            default:
                return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
        }
    };

    const getProgressStepInfo = (state: string) => {
        const stepMap: Record<string, { step: number; total: number; label: string }> = {
            "validating": { step: 1, total: 4, label: "Validando datos" },
            "creating-history": { step: 2, total: 4, label: "Creando historia" },
            "creating-diagnostic": { step: 3, total: 4, label: "Registrando diagnóstico" },
            "uploading-documents": { step: 4, total: 4, label: "Subiendo documentos" }
        };

        return stepMap[state] || { step: 1, total: 4, label: "Procesando" };
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    const handleDismiss = () => {
        setIsVisible(false);
        onMessageDismiss?.();
    };

    // ========================================================================
    // RENDER CONDITIONS
    // ========================================================================

    // No renderizar si no hay mensajes
    if (!hasStatusMessage && !hasOrchestrationProgress) {
        return null;
    }

    return (
        <div className="space-y-4">
            {/* Orchestration Progress */}
            {hasOrchestrationProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-medium text-blue-900">
                                Procesando formulario...
                            </p>
                            <p className="text-sm text-blue-700">
                                {orchestrationProgress.currentStep || "Preparando datos"}
                            </p>
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="text-right">
                            {orchestrationProgress.progress ? (
                                <div className="text-sm text-blue-600 font-medium">
                                    {orchestrationProgress.progress.current} / {orchestrationProgress.progress.total}
                                </div>
                            ) : (
                                <div className="text-sm text-blue-600 font-medium">
                                    {(() => {
                                        const stepInfo = getProgressStepInfo(orchestrationProgress.state);
                                        return `${stepInfo.step}/${stepInfo.total}`;
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="bg-blue-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                    width: `${(() => {
                                        if (orchestrationProgress.progress) {
                                            return (orchestrationProgress.progress.current / orchestrationProgress.progress.total) * 100;
                                        }
                                        const stepInfo = getProgressStepInfo(orchestrationProgress.state);
                                        return (stepInfo.step / stepInfo.total) * 100;
                                    })()}%` 
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Status Messages */}
            {hasStatusMessage && (
                <div className={getMessageClasses(statusMessage.type)}>
                    {getMessageIcon(statusMessage.type)}
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <p className="font-medium text-sm">
                                    {statusMessage.text}
                                </p>
                                
                                {statusMessage.details && (
                                    <p className="text-xs mt-1 opacity-90">
                                        {statusMessage.details}
                                    </p>
                                )}

                                {/* Timestamp */}
                                {showTimestamp && statusMessage.timestamp && (
                                    <p className="text-xs mt-1 opacity-75">
                                        {formatTimestamp(statusMessage.timestamp)}
                                    </p>
                                )}

                                {/* Auto-hide countdown */}
                                {timeLeft !== null && timeLeft > 0 && (
                                    <p className="text-xs mt-1 opacity-75">
                                        Se ocultará en {timeLeft}s
                                    </p>
                                )}
                            </div>

                            {/* Dismiss Button */}
                            {allowDismiss && (
                                <button
                                    onClick={handleDismiss}
                                    className="p-1 rounded hover:bg-black hover:bg-opacity-10 transition-colors"
                                    title="Cerrar mensaje"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// HOOKS DE CONVENIENCIA
// ============================================================================

/**
 * Hook para manejar mensajes de estado de forma simplificada
 */
export function useStatusMessages() {
    const [message, setMessage] = useState<StatusMessage | null>(null);

    const showMessage = (
        type: Exclude<MessageType, null>, 
        text: string, 
        details?: string,
        persistent = false
    ) => {
        setMessage({
            type,
            text,
            details,
            persistent,
            timestamp: Date.now()
        });
    };

    const clearMessage = () => {
        setMessage(null);
    };

    const showSuccess = (text: string, details?: string) => 
        showMessage("success", text, details);
    
    const showError = (text: string, details?: string) => 
        showMessage("error", text, details);
    
    const showInfo = (text: string, details?: string, persistent = false) => 
        showMessage("info", text, details, persistent);
    
    const showWarning = (text: string, details?: string) => 
        showMessage("warning", text, details);

    return {
        message,
        showMessage,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        clearMessage
    };
}