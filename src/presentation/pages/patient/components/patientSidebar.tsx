import { SidebarMenuButton } from "../../../components/ui/sidebar";
import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import { CalendarCheck, FileHeart, FileVideoCamera, LayoutGrid, Microscope, PillBottle, Settings, User } from "lucide-react";


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
];

export function PatientSidebar() {
    return (
        <SidebarBase label="Patient Sidebar">
            <SidebarMenuButton className="font-sans" asChild>
                <a href="#" className="flex items-center gap-2 hover:bg-cuidarte-tertiary/10 p-2 rounded-md">
                    <LayoutGrid className="" />
                    <span>Inicio</span>
                </a>
            </SidebarMenuButton>
            <SidebarGroupComponent label="CITAS Y TELEMEDICINA" items={items} />
            <SidebarGroupComponent label="INFORMACIÓN MÉDICA" items={infoItems} />
            <SidebarGroupComponent label="PERFIL Y CONFIGURACIÓN" items={profileItems} />
        </SidebarBase>
    );
}