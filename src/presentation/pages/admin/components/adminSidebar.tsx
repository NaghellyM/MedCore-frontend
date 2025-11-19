import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import { UsersRound, Upload, Shield, HeartPulse, LayoutGrid, Activity, KeySquare, ClockFading, Boxes, Bell } from "lucide-react";

const items = [
    { title: "Registro de usuarios", url: "/admin/registerUser", icon: UsersRound },
    { title: "Carga Masiva de Usuarios", url: "/admin/registerCSV", icon: Upload },
    { title: "Gestión de pacientes", url: "/admin/patients", icon: HeartPulse },
    { title: "Gestión de médicos", url: "/admin/doctors", icon: UsersRound },
    { title: "Lista de enfermeros", url: "/admin/nursesList", icon: UsersRound },
    { title: "Lista de médicos", url: "/admin/doctorsList", icon: UsersRound },
];

const securityItems = [
    { title: "Autenticación", url: "#", icon: Shield },
    { title: "Políticas de contraseña", url: "#", icon: KeySquare },
    { title: "Gestión de sesiones", url: "#", icon: ClockFading },
];

const doctorItems = [
    { title: "Gestión de citas", url: "/admin/adminAppointments", icon: UsersRound },
];

const operationItems = [
    { title: "Monitoreo", url: "#", icon: Activity },
    { title: "Inventario", url: "#", icon: Boxes },
    { title: "Notificaciones", url: "#", icon: Bell },
    { title: "Logs de auditoría", url: "#", icon: LayoutGrid },
];

export function AdminSidebar() {
    return (
        <SidebarBase label="Admin Sidebar">
            <SidebarGroupComponent label="GESTIÓN DE USUARIOS" items={items} />
            <SidebarGroupComponent label="SEGURIDAD" items={securityItems} />
            <SidebarGroupComponent label="OPERACIONES" items={operationItems} />
            <SidebarGroupComponent label="GESTIÓN DE DOCTORES" items={doctorItems} />
        </SidebarBase>
    );
}
