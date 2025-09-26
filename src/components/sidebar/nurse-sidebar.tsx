import {
    Search,
    ClipboardPlus,
    HeartPlus,
    BriefcaseMedical,
    Activity,
    Siren,
    Settings,
    BookUser,
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

const patientsItems = [
    {
        title: "Buscar pacientes",
        url: "#",
        icon: Search,
    },
    {
        title: "Registro de procedimientos",
        url: "#",
        icon: ClipboardPlus,
    },
    {
        title: "Registro de signos vitales",
        url: "#",
        icon: HeartPlus,
    },
    {
        title: "Medicamentos pacoientes",
        url: "#",
        icon: BriefcaseMedical,
    },
];

const monitorItems = [
    {
        title: "Monitoreo en tiempo real",
        url: "#",
        icon: Activity,
    },
    {
        title: "Alertas de inventario",
        url: "#",
        icon: Siren,
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

export function NurseSidebar() {
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
                            {patientsItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.title}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarGroupLabel>MONITOREO CLÍNICO</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {monitorItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton>
                                        <item.icon className="mr-2 h-4 w-4" />
                                        {item.title}
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
