import * as React from "react";
import {
    SidebarProvider, Sidebar, SidebarInset, SidebarContent,
    SidebarTrigger,
} from "../components/ui/sidebar";
import UserHeader from "../components/globals/header";
import { SmartSidebar } from "../components/globals/sidebar/SmartSidebar";
import { cn } from "../../core/utils/cn";
import { useBreakpoint, useIsMobileSidebar } from "../../core/hooks/ui";
import { ResponsiveStyleUtils } from "../../core/utils/responsiveStyles";

/**
 * Props del layout inteligente
 */
interface AutoDashboardLayoutProps {
    children: React.ReactNode;
    showSearch?: boolean;
    headerHeightClass?: string;
    contentMaxWidthClass?: string;
    mainClassName?: string;
    sidebarClassName?: string;
    sidebarContentClassName?: string;
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
    sidebarStrategy?: 'existing' | 'dynamic';
    customSidebar?: React.ReactNode;
}

/**
 * Layout de dashboard inteligente que automáticamente muestra el sidebar correcto
 * 
 * Este componente extiende el DashboardLayout original agregando la capacidad
 * de mostrar automáticamente el sidebar apropiado según el rol del usuario.
 * 
 * Características:
 * - Detecta automáticamente el rol del usuario
 * - Muestra el sidebar correspondiente sin configuración manual
 * - Mantiene compatibilidad con sidebar personalizado
 * - Soporte para diferentes estrategias de renderizado
 */
export function AutoDashboardLayout({
    children,
    showSearch = true,
    headerHeightClass = "pt-[80px]",
    contentMaxWidthClass = "max-w-7xl",
    sidebarContentClassName = "",
    variant = "inset",
    collapsible = "icon",
    sidebarStrategy = 'existing',
    customSidebar,
}: AutoDashboardLayoutProps) {
    const breakpoint = useBreakpoint();
    const isMobileSidebar = useIsMobileSidebar();
    
    // Obtener configuración del sidebar y estilos responsive
    const sidebarConfig = ResponsiveStyleUtils.getSidebarConfig(breakpoint, collapsible, variant);
    const responsivePadding = ResponsiveStyleUtils.getResponsivePadding(breakpoint);

    // Determinar qué sidebar usar
    const sidebarContent = customSidebar || <SmartSidebar strategy={sidebarStrategy} />;

    return (
        <SidebarProvider defaultOpen={sidebarConfig.defaultOpen}>
            {/* Header fijo en la parte superior */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-colors duration-300">
                <UserHeader showSearch={showSearch} showThemeToggle={true} />
            </div>

            {/* Sidebar */}
            <Sidebar
                side="left"
                variant={sidebarConfig.variant}
                collapsible={sidebarConfig.collapsible}
                className="print:hidden"
            >
                <SidebarContent className={cn("", sidebarContentClassName)}>
                    {sidebarContent}
                </SidebarContent>
            </Sidebar>

            {/* Contenido principal que ocupa todo el espacio disponible */}
            <SidebarInset className="min-h-screen w-full bg-background flex-1 transition-colors duration-300">
                <div className={cn(headerHeightClass || "pt-[80px]", "min-h-screen w-full bg-background transition-colors duration-300")}> 
                    <SidebarTrigger className={cn(
                        "flex justify-start p-4",
                        isMobileSidebar ? "block" : "hidden"
                    )} />
                    <div className={cn(
                        "w-full h-full bg-background transition-colors duration-300",
                        responsivePadding
                    )}>
                        <div className={cn("w-full mx-auto", contentMaxWidthClass)}>
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}