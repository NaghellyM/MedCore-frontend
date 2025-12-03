/**
 * COMPONENTES DE ESTADO REUTILIZABLES
 * ===================================
 * Componentes para estados de carga, error y vacío
 */

import React from "react";
import { Loader2, AlertCircle, FileText, RefreshCw } from "lucide-react";

interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({ message = "Cargando...", className = "" }: LoadingStateProps) {
    return (
        <div className={`flex items-center justify-center py-12 ${className}`}>
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({ 
    title = "Error", 
    message, 
    onRetry, 
    className = "" 
}: ErrorStateProps) {
    return (
        <div className={`rounded-xl border border-destructive/50 bg-destructive/10 p-6 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="p-2 bg-destructive/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-1">{title}</h3>
                    <p className="text-sm text-destructive/80">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-3 flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reintentar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ 
    icon, 
    title, 
    description, 
    action, 
    className = "" 
}: EmptyStateProps) {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                {icon || <FileText className="h-8 w-8 text-muted-foreground" />}
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

interface CardContainerProps {
    children: React.ReactNode;
    title?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export function CardContainer({ 
    children, 
    title, 
    icon, 
    actions, 
    className = "" 
}: CardContainerProps) {
    return (
        <div className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-300 ${className}`}>
            {title && (
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 px-6 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {icon && (
                                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                    {icon}
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-foreground">{title}</h2>
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
