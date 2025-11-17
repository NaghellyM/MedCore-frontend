import React from 'react';
import { useUserRole } from '../../../../core/hooks/auth/useUserRole';
import { AdminSidebar } from '../../../pages/admin/components/adminSidebar';
import DoctorSidebar from '../../../pages/doctor/components/doctorSideBar';
import { NurseSidebar } from '../../../pages/nurse/components/nurseSidebar';
import { PatientSidebar } from '../../../pages/patient/components/patientSidebar';
import { SidebarBase } from './sidebarBase';

/**
 * Componente centralizado para renderizar el sidebar según el rol del usuario
 * 
 * Este componente utiliza el hook useUserRole para obtener el rol del usuario
 * autenticado y renderizar el sidebar correspondiente.
 */
export const RoleBasedSidebar: React.FC = () => {
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

    // Renderizar el sidebar según el rol
    switch (role) {
        case 'admin':
            return <AdminSidebar />;
        
        case 'doctor':
            return <DoctorSidebar />;
        
        case 'nurse':
            return <NurseSidebar />;
        
        case 'patient':
            return <PatientSidebar />;
        
        default:
            // Fallback: mostrar sidebar de paciente por defecto
            console.warn(`Rol desconocido: ${role}. Mostrando sidebar de paciente por defecto.`);
            return <PatientSidebar />;
    }
};