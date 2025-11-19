import React from 'react';
import { SmartDashboardLayout } from '../../layouts/SmartDashboardLayout';
import { useUserRole } from '../../../core/hooks/auth/useUserRole';
import { DoctorPage } from '../doctor/page/doctorPage';
import { AdminPageContent } from '../admin/page/adminPageContent';
import { PatientPageContent } from '../patient/page/patientPage';
import { NursePageContent } from '../nurse/page/nursePage';

/**
 * Componente de contenido dinámico según el rol
 */
const RoleBasedContent: React.FC = () => {
    const { role, loading } = useUserRole();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-lg text-gray-500">Cargando contenido...</div>
            </div>
        );
    }

    switch (role) {
        case 'admin':
            return <AdminPageContent />;
        
        case 'doctor':
            return <DoctorPage />;
        
        case 'nurse':
            return <NursePageContent />;
        
        case 'patient':
            return <PatientPageContent />;
        
        default:
            return (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg text-red-500">
                        Rol no reconocido: {role}
                    </div>
                </div>
            );
    }
};

/**
 * Dashboard unificado que funciona para todos los roles
 * 
 * Este componente automáticamente:
 * - Detecta el rol del usuario autenticado
 * - Muestra el sidebar apropiado
 * - Renderiza el contenido correspondiente al rol
 * 
 * Uso:
 * - Reemplaza los dashboards específicos por rol
 * - Simplifica el routing
 * - Centraliza la lógica de renderizado por rol
 */
export const UnifiedDashboard: React.FC = () => {
    return (
        <SmartDashboardLayout
            showSearch={true}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-7xl"
            variant="inset"
            collapsible="icon"
            sidebarStrategy="existing" // Usar sidebars existentes
        >
            <div className="min-h-[calc(100vh-5rem)] w-full">
                <RoleBasedContent />
            </div>
        </SmartDashboardLayout>
    );
};