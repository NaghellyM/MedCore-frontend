import { useIsMobile } from "./useBreakpointQueries";

/**
 * Hook específico para determinar si el sidebar debe estar en modo móvil
 * 
 * En móvil, el sidebar debe:
 * - Usar modo "offcanvas" (overlay)
 * - Estar cerrado por defecto
 * - Mostrarse solo cuando se activa
 * 
 * @returns true si el dispositivo es móvil y el sidebar debe usar comportamiento móvil
 */
export function useIsMobileSidebar(): boolean {
    return useIsMobile();
}