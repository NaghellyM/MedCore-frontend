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
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../ui/sidebar";


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
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenuButton asChild>
                        <a href="#">
                            <LayoutGrid />
                            <span>Inicio</span>
                        </a>
                    </SidebarMenuButton>
                    <SidebarGroupLabel>GESTIÓN DE USUARIOS</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>SEGURIDAD</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {securityItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>OPERACIÓN</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {operationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
