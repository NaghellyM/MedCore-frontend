import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import {
  Calendar,
  Users,
  ClipboardPlus,
  FolderUp,
  FilePlus,
} from "lucide-react";

const gestionClinicaItems = [
  { title: "Mis Citas", url: "/doctorAppointmentsList", icon: Calendar },
  { title: "Cola de Pacientes", url: "/queueDoctor", icon: Users },
  { title: "Subir Documentos", url: "/documentsUpload", icon: FolderUp },
];

const pacienteItems = [
  { title: "Historiales médicos", url: "/medicalHistory/list", icon: ClipboardPlus },
  { title: "Crear Historia Médica", url: "/medicalHistory/create", icon: FilePlus },
];


export default function DoctorSidebar() {
  return (
    <SidebarBase label="Doctor Sidebar">
      <SidebarGroupComponent label="GESTIÓN CLÍNICA" items={gestionClinicaItems} />
      <SidebarGroupComponent label="PACIENTES" items={pacienteItems} />
    </SidebarBase>
  );
}
