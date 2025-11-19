import React from 'react';
import { useUserRole } from '../../../../core/hooks/auth/useUserRole';
import { getMenuConfigByRole } from './menuConfig';
import { SidebarBase } from './sidebarBase';
import { SidebarGroupComponent } from './SidebarGroup';

/**
 * Componente de sidebar dinámico basado en configuración
 * 
 * Este componente utiliza la configuración centralizada de menús
 * para renderizar el sidebar apropiado según el rol del usuario.
 */
export const DynamicSidebar: React.FC = () => {
    const { role, loading, isAuthenticated } = useUserRole();

    // Mostrar estado de carga
    if (loading) {
        return (
            <SidebarBase>
                <div className="flex items-center justify-center p-4">
                    <div className="text-sm text-gray-500">Cargando...</div>
                </div>
            </SidebarBase>
        );
    }

    // Si no está autenticado, no mostrar sidebar
    if (!isAuthenticated) {
        return null;
    }

    // Obtener la configuración de menú para el rol actual
    const menuConfig = getMenuConfigByRole(role);

    return (
        <SidebarBase>
            {menuConfig.groups.map((group, index) => (
                <SidebarGroupComponent
                    key={`${role}-${index}-${group.label}`}
                    label={group.label}
                    items={group.items}
                />
            ))}
        </SidebarBase>
    );
};