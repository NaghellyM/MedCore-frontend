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
    SidebarMenuButton,
} from "../ui/sidebar";
import { SidebarGroupComponent } from "../ui/SidebarGroup";

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
                <SidebarMenuButton asChild>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:bg-gray-100 w-full">
                        <LayoutGrid />
                        <span>INICIO</span>
                    </button>
                </SidebarMenuButton>
                <SidebarGroupComponent label="PACIENTES" items={items} />
                <SidebarGroupComponent label="AGENDA" items={scheduleItems} />
                <SidebarGroupComponent label="MI PERFIL" items={profileItems} />
            </SidebarContent>
        </Sidebar>
    )
};