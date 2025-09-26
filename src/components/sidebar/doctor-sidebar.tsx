import {
    Search,
    Users,
    FileHeart,
    CalendarDays,
    FileVideoCamera,
    Pill,
    ArrowRight,
    BookUser,
    Settings,
    User,
    LayoutGrid,
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
        title: "Buscar pacientes",
        url: "#",
        icon: Search,
    },
    {
        title: "Mis pacientes",
        url: "#",
        icon: Users,
    },
    {
        title: "Historial clínico",
        url: "#",
        icon: FileHeart,
    },
    {
        title: "Medicamentos",
        url: "#",
        icon: Pill,
    },
];

const scheduleItems = [
    {
        title: "Mi agenda",
        url: "#",
        icon: CalendarDays,
    },
    {
        title: "Telemedicina",
        url: "#",
        icon: FileVideoCamera,
    },
    {
        title: "Derivaciones",
        url: "#",
        icon: ArrowRight,
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

export function DoctorSidebar() {
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

                    <SidebarGroupLabel>GESTIÓN DE PACIENTES</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>AGENDA Y CITAS</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {scheduleItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>PERFIL Y AJUSTES</SidebarGroupLabel>
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
    )
};