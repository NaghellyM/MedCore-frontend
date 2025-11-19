import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../../core/utils/cn";

export interface LoadingStateProps {
    title?: string;
    description?: string;
    className?: string;
    skeletonCount?: number;
}

/**
 * Componente reutilizable para estados de carga
 */
export function LoadingState({ 
    title = "Cargando...", 
    description = "Por favor, espera un momento.",
    className,
    skeletonCount = 2
}: LoadingStateProps) {
    return (
        <Card className={cn("w-full max-w-2xl border-0 shadow-lg", className)}>
            <CardHeader>
                <CardTitle className="text-slate-900">{title}</CardTitle>
                <CardDescription className="text-slate-600">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
                <div className="h-10 w-1/3 bg-slate-100 rounded animate-pulse" />
                {Array.from({ length: skeletonCount }).map((_, index) => (
                    <div key={index} className="h-16 w-full bg-slate-100 rounded animate-pulse" />
                ))}
            </CardContent>
        </Card>
    );
}

export interface ErrorStateProps {
    title?: string;
    description?: string;
    error: string;
    onRetry?: () => void;
    onBack?: () => void;
    retryLabel?: string;
    backLabel?: string;
    className?: string;
}

/**
 * Componente reutilizable para estados de error
 */
export function ErrorState({
    title = "Ha ocurrido un error",
    description,
    error,
    onRetry,
    onBack,
    retryLabel = "Reintentar",
    backLabel = "Volver",
    className
}: ErrorStateProps) {
    return (
        <Card className={cn("w-full max-w-2xl border-0 shadow-lg", className)}>
            <CardHeader>
                <CardTitle className="text-slate-900">{title}</CardTitle>
                <CardDescription className="text-slate-600">
                    {description || error}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex items-center gap-2">
                {onRetry && (
                    <Button onClick={onRetry}>{retryLabel}</Button>
                )}
                {onBack && (
                    <Button variant="ghost" onClick={onBack}>{backLabel}</Button>
                )}
            </CardContent>
        </Card>
    );
}

export interface StateWrapperProps {
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
    onBack?: () => void;
    loadingProps?: LoadingStateProps;
    errorProps?: Omit<ErrorStateProps, 'error' | 'onRetry' | 'onBack'>;
    children: React.ReactNode;
}

/**
 * Wrapper que maneja automáticamente estados de loading, error y contenido
 */
export function StateWrapper({
    loading,
    error,
    onRetry,
    onBack,
    loadingProps,
    errorProps,
    children
}: StateWrapperProps) {
    if (loading) {
        return <LoadingState {...loadingProps} />;
    }

    if (error) {
        return (
            <ErrorState 
                {...errorProps}
                error={error}
                onRetry={onRetry}
                onBack={onBack}
            />
        );
    }

    return <>{children}</>;
}