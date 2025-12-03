import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import {
  
  Calendar,
  Users,
  Stethoscope,
  FileText,
  Pill,
  ClipboardList,
  FolderOpen,
  FolderUp,
} from "lucide-react";



const atencionMedicaItems = [
  { title: "Mis Citas", url: "/doctorAppointmentsList", icon: Calendar },
  { title: "Cola de Pacientes", url: "/queueDoctor", icon: Users },
  { title: "Consulta Médica", url: "/consultation", icon: Stethoscope },
];

const gestionPacientesItems = [
  { title: "Historiales Médicos", url: "/medicalHistory/list", icon: FolderOpen },
  { title: "Diagnósticos", url: "/diagnostics", icon: FileText },
];

const tratamientoItems = [
  { title: "Recetas Médicas", url: "/prescriptions", icon: Pill },
  { title: "Órdenes Médicas", url: "/orders", icon: ClipboardList },
];

const documentosItems = [
  { title: "Subir Documentos", url: "/documentsUpload", icon: FolderUp },
];

export default function DoctorSidebar() {
  return (
    <SidebarBase label="Panel Médico">
      <SidebarGroupComponent label="ATENCIÓN MÉDICA" items={atencionMedicaItems} />
      <SidebarGroupComponent label="GESTIÓN DE PACIENTES" items={gestionPacientesItems} />
      <SidebarGroupComponent label="TRATAMIENTO" items={tratamientoItems} />
      <SidebarGroupComponent label="DOCUMENTOS" items={documentosItems} />
    </SidebarBase>
  );
}
