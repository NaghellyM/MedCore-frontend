import React from 'react';
import { RoleBasedSidebar } from './RoleBasedSidebar';
import { DynamicSidebar } from './DynamicSidebar';

/**
 * Props del componente de sidebar inteligente
 */
interface SmartSidebarProps {
    /**
     * Determina qué estrategia usar para renderizar el sidebar:
     * - 'existing': Usa los componentes de sidebar existentes (AdminSidebar, DoctorSidebar, etc.)
     * - 'dynamic': Usa la configuración centralizada de menús
     */
    strategy?: 'existing' | 'dynamic';
}

/**
 * Componente de sidebar inteligente que adapta su contenido al rol del usuario
 * 
 * Este componente actúa como punto de entrada centralizado para mostrar
 * el sidebar apropiado según el rol del usuario autenticado.
 * 
 * Ofrece dos estrategias:
 * 1. 'existing' (por defecto): Usa los componentes de sidebar ya implementados
 * 2. 'dynamic': Usa una configuración centralizada más flexible
 * 
 * @param strategy - Estrategia a utilizar ('existing' | 'dynamic')
 */
export const SmartSidebar: React.FC<SmartSidebarProps> = ({
    strategy = 'existing'
}) => {
    switch (strategy) {
        case 'dynamic':
            return <DynamicSidebar />;

        case 'existing':
        default:
            return <RoleBasedSidebar />;
    }
};

// Export por defecto para facilidad de importación
export default SmartSidebar;