import * as React from "react";

 // Tipos de breakpoint estandarizados para toda la aplicación 
export type Breakpoint = "mobile" | "tablet" | "desktop";

/**
 * Configuración centralizada de breakpoints
 * - Mobile: < 640px
 * - Tablet: 640px - 1024px  
 * - Desktop: > 1024px
 */
export const BREAKPOINTS = {
    MOBILE_MAX: 639,
    TABLET_MIN: 640,
    TABLET_MAX: 1024,
    DESKTOP_MIN: 1024,
} as const;

// Determina el breakpoint actual basado en el ancho de ventana
function getCurrentBreakpoint(): Breakpoint {
    if (typeof window === "undefined") return "desktop";
    
    const width = window.innerWidth;
    if (width < 640) return "mobile";
    if (width >= 640 && width <= 1024) return "tablet";
    return "desktop";
}

/**
 * Hook principal para detección de breakpoints responsive
 * Utiliza MediaQuery API para mejor rendimiento
 * 
 * @returns El breakpoint actual
 */
export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(() => getCurrentBreakpoint());

    React.useEffect(() => {
        // Crear media queries para cada breakpoint
        const mobileQuery = window.matchMedia(`(max-width: 639px)`);
        const tabletQuery = window.matchMedia(`(min-width: 640px) and (max-width: 1024px)`);
        const desktopQuery = window.matchMedia(`(min-width: 1025px)`);

        const updateBreakpoint = () => setBreakpoint(getCurrentBreakpoint());

        // Función helper para manejar compatibilidad de addEventListener
        const addListener = (mediaQuery: MediaQueryList, callback: () => void) => {
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener("change", callback);
            } else {
                // Fallback para navegadores antiguos
                mediaQuery.addListener(callback);
            }
        };

        const removeListener = (mediaQuery: MediaQueryList, callback: () => void) => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener("change", callback);
            } else {
                // Fallback para navegadores antiguos
                mediaQuery.removeListener(callback);
            }
        };

        // Agregar listeners
        addListener(mobileQuery, updateBreakpoint);
        addListener(tabletQuery, updateBreakpoint);
        addListener(desktopQuery, updateBreakpoint);

        // Verificación inicial
        updateBreakpoint();

        // Cleanup
        return () => {
            removeListener(mobileQuery, updateBreakpoint);
            removeListener(tabletQuery, updateBreakpoint);
            removeListener(desktopQuery, updateBreakpoint);
        };
    }, []);

    return breakpoint;
}