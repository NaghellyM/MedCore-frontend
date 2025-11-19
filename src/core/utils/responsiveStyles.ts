import type { Breakpoint } from "../hooks/ui/useBreakpoint";

/**
 * Utilidades para obtener clases de estilo responsive
 */
export class ResponsiveStyleUtils {
    /**
     * Obtiene las clases de padding apropiadas según el breakpoint
     * @param breakpoint - El breakpoint actual
     * @returns Las clases de Tailwind CSS para padding
     */
    static getResponsivePadding(breakpoint: Breakpoint): string {
        switch (breakpoint) {
            case 'mobile': 
                return 'px-4 py-4';
            case 'tablet': 
                return 'px-6 py-6';
            case 'desktop': 
                return 'px-8 py-6';
            default: 
                return 'px-4 py-6';
        }
    }

    /**
     * Obtiene la configuración del sidebar según el breakpoint
     * @param breakpoint - El breakpoint actual
     * @param defaultCollapsible - El modo collapsible por defecto
     * @param defaultVariant - La variante por defecto
     * @returns Configuración del sidebar
     */
    static getSidebarConfig(
        breakpoint: Breakpoint,
        defaultCollapsible: "offcanvas" | "icon" | "none" = "icon",
        defaultVariant: "sidebar" | "floating" | "inset" = "inset"
    ) {
        const isMobile = breakpoint === 'mobile';
        return {
            collapsible: isMobile ? "offcanvas" as const : defaultCollapsible,
            variant: isMobile ? "sidebar" as const : defaultVariant,
            defaultOpen: !isMobile
        };
    }
}