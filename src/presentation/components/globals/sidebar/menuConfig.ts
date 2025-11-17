import type { NormalizedRole } from '../../../../core/types/shared/roles';
import type { LucideIcon } from 'lucide-react';

/**
 * Estructura de un elemento de menú
 */
export interface MenuItem {
    title: string;
    url: string;
    icon: LucideIcon;
}

/**
 * Estructura de un grupo de menú
 */
export interface MenuGroup {
    label: string;
    items: MenuItem[];
}

/**
 * Configuración completa de menú para un rol
 */
export interface MenuConfig {
    groups: MenuGroup[];
}

/**
 * Función que retorna la configuración de menú según el rol del usuario
 * 
 * Esta función centraliza toda la lógica de configuración de menús,
 * evitando duplicación y facilitando el mantenimiento.
 * 
 * @param role - Rol normalizado del usuario
 * @returns Configuración de menú para el rol especificado
 */
export const getMenuConfigByRole = (role: NormalizedRole): MenuConfig => {
    switch (role) {
        case 'admin':
            return getAdminMenuConfig();
        
        case 'doctor':
            return getDoctorMenuConfig();
        
        case 'nurse':
            return getNurseMenuConfig();
        
        case 'patient':
            return getPatientMenuConfig();
        
        default:
            console.warn(`Rol desconocido: ${role}. Usando configuración de paciente por defecto.`);
            return getPatientMenuConfig();
    }
};

/**
 * Configuración de menú para administradores
 */
const getAdminMenuConfig = (): MenuConfig => {
    // Importaciones dinámicas para evitar problemas de dependencias circulares
    const { UsersRound, Upload, Shield, HeartPulse, LayoutGrid, Activity, KeySquare, ClockFading, Boxes, Bell } = require('lucide-react');
    
    return {
        groups: [
            {
                label: 'GESTIÓN DE USUARIOS',
                items: [
                    { title: 'Registro de usuarios', url: '/admin/registerUser', icon: UsersRound },
                    { title: 'Carga Masiva de Usuarios', url: '/admin/registerCSV', icon: Upload },
                    { title: 'Gestión de pacientes', url: '/admin/patients', icon: HeartPulse },
                    { title: 'Gestión de médicos', url: '/admin/doctors', icon: UsersRound },
                    { title: 'Lista de enfermeros', url: '/admin/nursesList', icon: UsersRound },
                    { title: 'Lista de médicos', url: '/admin/doctorsList', icon: UsersRound },
                ]
            },
            {
                label: 'SEGURIDAD',
                items: [
                    { title: 'Autenticación', url: '#', icon: Shield },
                    { title: 'Políticas de contraseña', url: '#', icon: KeySquare },
                    { title: 'Gestión de sesiones', url: '#', icon: ClockFading },
                ]
            },
            {
                label: 'OPERACIONES',
                items: [
                    { title: 'Monitoreo', url: '#', icon: Activity },
                    { title: 'Inventario', url: '#', icon: Boxes },
                    { title: 'Notificaciones', url: '#', icon: Bell },
                    { title: 'Logs de auditoría', url: '#', icon: LayoutGrid },
                ]
            },
            {
                label: 'GESTIÓN DE DOCTORES',
                items: [
                    { title: 'Gestión de citas', url: '/admin/adminAppointments', icon: UsersRound },
                ]
            }
        ]
    };
};

/**
 * Configuración de menú para médicos
 */
const getDoctorMenuConfig = (): MenuConfig => {
    const { Calendar, BookUser, ClipboardPlus } = require('lucide-react');
    
    return {
        groups: [
            {
                label: 'PERFIL MÉDICO',
                items: [
                    { title: 'Agenda', url: '/doctorAppointmentsList', icon: Calendar },
                    { title: 'Próximas citas', url: '/queueDoctor', icon: BookUser },
                ]
            },
            {
                label: 'PACIENTES',
                items: [
                    { title: 'Historiales médicos', url: '/medicalHistory/list', icon: ClipboardPlus },
                    { title: 'Crear historia clínica', url: '/medicalHistory/create', icon: ClipboardPlus },
                ]
            }
        ]
    };
};

/**
 * Configuración de menú para enfermeros
 */
const getNurseMenuConfig = (): MenuConfig => {
    const { Search, ClipboardPlus, HeartPlus, BriefcaseMedical, Activity, Siren, Settings, BookUser, User } = require('lucide-react');
    
    return {
        groups: [
            {
                label: 'GESTIÓN DE PACIENTES',
                items: [
                    { title: 'Buscar pacientes', url: '#', icon: Search },
                    { title: 'Registro de procedimientos', url: '#', icon: ClipboardPlus },
                    { title: 'Registro de signos vitales', url: '#', icon: HeartPlus },
                    { title: 'Medicamentos pacientes', url: '#', icon: BriefcaseMedical },
                ]
            },
            {
                label: 'MONITOREO CLÍNICO',
                items: [
                    { title: 'Monitoreo en tiempo real', url: '#', icon: Activity },
                    { title: 'Alertas de inventario', url: '#', icon: Siren },
                ]
            },
            {
                label: 'MI PERFIL',
                items: [
                    { title: 'Mi perfil', url: '#', icon: User },
                    { title: 'Configuración', url: '#', icon: Settings },
                    { title: 'Contactos de emergencia', url: '#', icon: BookUser },
                ]
            }
        ]
    };
};

/**
 * Configuración de menú para pacientes
 */
const getPatientMenuConfig = (): MenuConfig => {
    const { CalendarCheck, History, FileHeart, Microscope, User, Settings } = require('lucide-react');
    
    return {
        groups: [
            {
                label: 'CITAS Y TELEMEDICINA',
                items: [
                    { title: 'Mis citas', url: '/PatientAppointments', icon: CalendarCheck },
                    { title: 'Turno de espera', url: '/queuePatient', icon: History },
                ]
            },
            {
                label: 'INFORMACIÓN MÉDICA',
                items: [
                    { title: 'Mi historial clínico', url: '/my-medical-history', icon: FileHeart },
                    { title: 'Resultados de laboratorio', url: '/patientPage', icon: Microscope },
                ]
            },
            {
                label: 'PERFIL Y CONFIGURACIÓN',
                items: [
                    { title: 'Mi perfil', url: '#', icon: User },
                    { title: 'Configuración', url: '#', icon: Settings },
                ]
            }
        ]
    };
};