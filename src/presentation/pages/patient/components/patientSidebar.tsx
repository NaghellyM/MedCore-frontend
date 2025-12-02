import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import { CalendarCheck, FileHeart, History, Microscope, FileText, FolderOpen } from "lucide-react";


const items = [
    {
        title: "Mis citas",
        url: "/patient-appointments",
        icon: CalendarCheck,
    },
    {
        title: "Solicitar cita",
        url: "/request-appointment",
        icon: FileText,
    },
    {
        title: "Turno de espera",
        url: "/patient-queue",
        icon: History,
    },
];

const infoItems = [
    {
        title: "Mi historial clínico",
        url: "/my-medical-history",
        icon: FileHeart,
    },
    {
        title: "Mis documentos",
        url: "/patient-documents",
        icon: FolderOpen,
    },
    {
        title: "Resultados de laboratorio",
        url: "/patient-documents",
        icon: Microscope,
    },
];

export function PatientSidebar() {
    return (
        <SidebarBase label="Patient Sidebar">
            <SidebarGroupComponent label="CITAS Y TELEMEDICINA" items={items} />
            <SidebarGroupComponent label="INFORMACIÓN MÉDICA" items={infoItems} />
        </SidebarBase>
    );
}