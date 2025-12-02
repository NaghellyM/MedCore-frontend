import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import { UsersRound, Upload, Stethoscope, Users, CalendarCheck } from "lucide-react";

const userManagementItems = [
    { title: "Registro de usuarios", url: "/admin/registerUser", icon: UsersRound },
    { title: "Carga Masiva de Usuarios", url: "/admin/registerCSV", icon: Upload },
];

const staffManagementItems = [
    { title: "Lista de enfermeros", url: "/admin/nursesList", icon: Users },
    { title: "Lista de médicos", url: "/admin/doctorsList", icon: Stethoscope },
];

const appointmentItems = [
    { title: "Gestión de citas", url: "/admin/adminAppointments", icon: CalendarCheck },
];

export function AdminSidebar() {
    return (
        <SidebarBase label="Admin Sidebar">
            <SidebarGroupComponent label="GESTIÓN DE USUARIOS" items={userManagementItems} />
            <SidebarGroupComponent label="PERSONAL MÉDICO" items={staffManagementItems} />
            <SidebarGroupComponent label="CITAS MÉDICAS" items={appointmentItems} />
        </SidebarBase>
    );
}
