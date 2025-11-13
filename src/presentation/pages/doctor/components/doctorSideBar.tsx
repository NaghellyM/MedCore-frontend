
import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import {
  Calendar,
  User,
  Activity,
  BookUser,
  ClipboardPlus,
  HeartPulse,
} from "lucide-react";

const gestionClinicaItems = [
  { title: "Agenda", url: "/encounter", icon: Calendar },
  { title: "Medicamentos", url: "#", icon: Activity },
  { title: "Diagnósticos", url: "#", icon: HeartPulse },
];

const pacienteItems = [
  { title: "Pacientes", url: "#", icon: User },
  { title: "Historiales médicos", url: "#", icon: ClipboardPlus },
  { title: "Proximas citas", url: "/queueDoctor", icon: BookUser },
];
export default function DoctorSidebar() {
  return (
    <SidebarBase label="Doctor Sidebar">
      <SidebarGroupComponent label="PERFIL MÉDICO" items={gestionClinicaItems} />
      <SidebarGroupComponent label="PACIENTES" items={pacienteItems} />
    </SidebarBase>
  );
}
