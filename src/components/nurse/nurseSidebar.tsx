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

import { Sidebar, SidebarContent, SidebarMenuButton } from "../ui/sidebar";
import { SidebarGroupComponent } from "../ui/SidebarGroup";

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
        title: "Medicamentos pacientes",
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
                <SidebarMenuButton asChild>
                    <a href="#">
                        <LayoutGrid />
                        <span>Inicio</span>
                    </a>
                </SidebarMenuButton>
                <SidebarGroupComponent label="GESTIÓN DE PACIENTES" items={patientsItems} />
                <SidebarGroupComponent label="MONITOREO CLÍNICO" items={monitorItems} />
                <SidebarGroupComponent label="MI PERFIL" items={profileItems} />
            </SidebarContent>
        </Sidebar>
    );
}
