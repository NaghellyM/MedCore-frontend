import {
    LayoutGrid,
    UsersRound,
    Upload,
    Shield,
    HeartPulse,
    ClockFading,
    FileKey2,
    Activity,
    Boxes,
    FileStack,
    Bell,
    DatabaseBackup,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarMenuButton,
} from "../ui/sidebar";

import { SidebarGroupComponent } from "../ui/SidebarGroup";
const items = [
    {
        title: "Usuarios y Roles",
        url: "#",
        icon: UsersRound,
    },
    {
        title: "Carga Masiva de Usuarios",
        url: "#",
        icon: Upload,
    },
    {
        title: "Gestión de pacientes",
        url: "#",
        icon: HeartPulse,
    },
];

const securityItems = [
    {
        title: "Autenticación",
        url: "#",
        icon: Shield,
    },
    {
        title: "Politicas de contraseñas",
        url: "#",
        icon: FileKey2,
    },
    {
        title: "Gestion de sesiones",
        url: "#",
        icon: ClockFading,
    },
];

const operationItems = [
    {
        title: "Monitoreo",
        url: "#",
        icon: Activity,
    },
    {
        title: "Inventario",
        url: "#",
        icon: Boxes,
    },
    {
        title: "Backups",
        url: "#",
        icon: DatabaseBackup,
    },
    {
        title: "Notificaciones del sistema",
        url: "#",
        icon: Bell,
    },
    {
        title: "Logs de auditoria",
        url: "#",
        icon: FileStack,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar className="w-64 mt-10 border-r bg-white">
            <SidebarContent>
                <SidebarMenuButton className="font-sans" asChild>
                    <a href="#">
                        <LayoutGrid />
                        <span>Inicio</span>
                    </a>
                </SidebarMenuButton>
                <SidebarGroupComponent label="GESTIÓN DE USUARIOS" items={items} />
                <SidebarGroupComponent label="SEGURIDAD" items={securityItems} />
                <SidebarGroupComponent label="OPERACIONES" items={operationItems} />
            </SidebarContent>
        </Sidebar>
    );
}
