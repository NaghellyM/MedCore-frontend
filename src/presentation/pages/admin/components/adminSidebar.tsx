import { SidebarMenuButton } from "../../../components/ui/sidebar";
import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import { UsersRound, Upload, Shield, HeartPulse, LayoutGrid, Activity,KeySquare, ClockFading, Boxes,Bell } from "lucide-react";

const items = [
    { title: "Registro de usuarios", url: "#", icon: UsersRound },
    { title: "Carga Masiva de Usuarios", url: "#", icon: Upload },
    { title: "Gestión de pacientes", url: "#", icon: HeartPulse },
];

const securityItems = [
    { title: "Autenticación", url: "#", icon: Shield },
    { title: "Políticas de contraseña", url: "#", icon: KeySquare },
    { title: "Gestión de sesiones", url: "#", icon: ClockFading },
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
            <SidebarMenuButton className="font-sans" asChild>
                <a href="#" className="flex items-center gap-2 hover:bg-cuidarte-tertiary/10 p-2 rounded-md">
                    <LayoutGrid className="" />
                    <span>Inicio</span>
                </a>
            </SidebarMenuButton>
            <SidebarGroupComponent label="GESTIÓN DE USUARIOS" items={items} />
            <SidebarGroupComponent label="SEGURIDAD" items={securityItems} />
            <SidebarGroupComponent label="OPERACIONES" items={operationItems} />
        </SidebarBase>
    );
}
