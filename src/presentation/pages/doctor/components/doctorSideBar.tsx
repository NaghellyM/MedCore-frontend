
import { SidebarBase } from "../../../components/globals/sidebar/sidebarBase";
import { SidebarGroupComponent } from "../../../components/globals/sidebar/SidebarGroup";
import {
  Calendar,
  User,
  BookUser,
  ClipboardPlus,
  HeartPulse,
} from "lucide-react";

const gestionClinicaItems = [
  { title: "Agenda", url: "/doctorAppointmentsList", icon: Calendar },
  { title: "Diagnósticos", url: "/doctorDiagnosticos", icon: HeartPulse },
];

const pacienteItems = [
  { title: "Pacientes", url: "#", icon: User },
  { title: "Historiales médicos", url: "/medicalHistory/list", icon: ClipboardPlus },
  { title: "Crear historia clínica", url: "/medicalHistory/create", icon: ClipboardPlus },
  { title: "Próximas citas", url: "/queueDoctor", icon: BookUser },
];


export default function DoctorSidebar() {
  return (
    <SidebarBase label="Doctor Sidebar">
      <SidebarGroupComponent label="PERFIL MÉDICO" items={gestionClinicaItems} />
      <SidebarGroupComponent label="PACIENTES" items={pacienteItems} />
    </SidebarBase>
  );
}
