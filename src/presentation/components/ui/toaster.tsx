import { Toaster as Sonner } from "sonner";

export function Toaster() {
    return (
        <Sonner
            position="top-right"
            richColors
            expand={false}
            duration={5000}
            closeButton
            visibleToasts={3}
            theme="light"

            toastOptions={{
                classNames: {
                    toast: 'group toast border shadow-lg',
                    title: 'text-sm font-semibold',
                    description: 'text-sm opacity-90',
                    actionButton: 'bg-primary text-primary-foreground hover:bg-primary/90',
                    cancelButton: 'bg-muted text-muted-foreground hover:bg-muted/90',
                    closeButton: 'bg-white hover:bg-slate-100 border border-slate-200',
                    error: 'bg-red-50 border-red-200 text-red-900',
                    success: 'bg-green-50 border-green-200 text-green-900',
                    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
                    info: 'bg-blue-50 border-blue-200 text-blue-900',
                },
            }}
        />
    );
}