import {
    BookUser,
    CalendarCheck,
    FileHeart,
    FileVideoCamera,
    LayoutGrid,
    Microscope,
    PillBottle,
    Settings,
    User,
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
        title: "Mis citas",
        url: "#",
        icon: CalendarCheck,
    },
    {
        title: "Telemedicina",
        url: "#",
        icon: FileVideoCamera,
    },
];

const infoItems = [
    {
        title: "Historial clínico",
        url: "#",
        icon: FileHeart,
    },
    {
        title: "Resultados de laboratorio",
        url: "#",
        icon: Microscope,
    },
    {
        title: "Medicamentos",
        url: "#",
        icon: PillBottle,
    },
];

const profileItems = [
    {
        title: "Mi perfil",
        url: "#",
        icon: User,
    },
    {
        title: "Configuración",
        url: "#",
        icon: Settings,
    },
    {
        title: "Contactos de emergencia",
        url: "#",
        icon: BookUser,
    },
];
export function PatientSidebar() {
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
                    <SidebarGroupLabel>GESTIÓN DE CITAS</SidebarGroupLabel>
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
                    <SidebarGroupLabel>INFORMACIÓN DE SALUD</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {infoItems.map((item) => (
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
                    <SidebarGroupLabel>MI PERFIL</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {profileItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.title}
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
