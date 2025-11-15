import { useBreakpoint } from "./useBreakpoint";

/**
 * Hook para determinar si la pantalla está en modo móvil
 * 
 * @returns true si el breakpoint es mobile
 */
export function useIsMobile(): boolean {
    const breakpoint = useBreakpoint();
    return breakpoint === "mobile";
}

/**
 * Hook para determinar si la pantalla está en modo compacto (no desktop)
 * Útil para adaptaciones de UI que necesitan distinguir entre desktop y no-desktop
 * 
 * @returns true si el breakpoint es mobile o tablet
 */
export function useIsCompact(): boolean {
    const breakpoint = useBreakpoint();
    return breakpoint !== "desktop";
}

/**
 * Hook para determinar si es tablet específicamente
 * 
 * @returns true si el breakpoint es tablet
 */
export function useIsTablet(): boolean {
    const breakpoint = useBreakpoint();
    return breakpoint === "tablet";
}

/**
 * Hook para determinar si es desktop específicamente
 * 
 * @returns true si el breakpoint es desktop
 */
export function useIsDesktop(): boolean {
    const breakpoint = useBreakpoint();
    return breakpoint === "desktop";
}