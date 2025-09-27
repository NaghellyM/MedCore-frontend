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
    SidebarMenuButton
} from "../ui/sidebar";
import { SidebarGroupComponent } from "../ui/SidebarGroup";

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
                <SidebarMenuButton asChild>
                    <a href="#">
                        <LayoutGrid />
                        <span>INICIO</span>
                    </a>
                </SidebarMenuButton>
                <SidebarGroupComponent label="GESTIÓN DE CITAS" items={items} />
                <SidebarGroupComponent label="INFORMACIÓN DE SALUD" items={infoItems} />
                <SidebarGroupComponent label="MI PERFIL" items={profileItems} />
            </SidebarContent>
        </Sidebar>
    );
}
