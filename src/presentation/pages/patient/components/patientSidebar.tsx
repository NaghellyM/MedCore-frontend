import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import { CalendarCheck, FileHeart, History, Microscope, PillBottle, Settings, User } from "lucide-react";


const items = [
    {
        title: "Mis citas",
        url: "#",
        icon: CalendarCheck,
    },
    {
        title: "Turno de espera",
        url: "/queuePatient",
        icon: History,
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
        url: "/patientPage",
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
            <SidebarGroupComponent label="CITAS Y TELEMEDICINA" items={items} />
            <SidebarGroupComponent label="INFORMACIÓN MÉDICA" items={infoItems} />
            <SidebarGroupComponent label="PERFIL Y CONFIGURACIÓN" items={profileItems} />
        </SidebarBase>
    );
}