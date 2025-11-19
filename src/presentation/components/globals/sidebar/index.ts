/**
 * ÍNDICE DE COMPONENTES DE SIDEBAR
 * ================================
 * Exportaciones centralizadas para componentes de sidebar
 */

// Componentes base
export { SidebarBase } from './sidebarBase';
export { SidebarGroupComponent } from './SidebarGroup';
export { SidebarMenuItems } from './SidebarMenuItems';

// Componentes inteligentes
export { SmartSidebar } from './SmartSidebar';
export { RoleBasedSidebar } from './RoleBasedSidebar';
export { DynamicSidebar } from './DynamicSidebar';

// Configuración y tipos
export { getMenuConfigByRole } from './menuConfig';
export type { MenuItem, MenuGroup, MenuConfig } from './menuConfig';

// Hook relacionado
export { useUserRole } from '../../../../core/hooks/auth/useUserRole';

// Export por defecto
export { default } from './SmartSidebar';