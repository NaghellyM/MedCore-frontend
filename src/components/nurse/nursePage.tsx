import { InfoCard } from "../ui/sectionCard";
import { PatientTable } from "./nurseTable";
import { BriefcaseMedical, Siren, ClipboardClock } from "lucide-react";

export function NursePageContent() {
    const patientsData = [
        { name: "Juan Pérez", room: "101", alertColor: "0", priority: "Alta", lastUpdate: "2024-10-01 10:00" },
        { name: "María Gómez", room: "102", alertColor: "1", priority: "Media", lastUpdate: "2024-10-01 09:30" },
        { name: "Carlos López", room: "103", alertColor: "3", priority: "Baja", lastUpdate: "2024-10-01 08:45" },
        { name: "Ana Martínez", room: "104", alertColor: "0", priority: "Alta", lastUpdate: "2024-10-01 11:15" },
        { name: "Luis Rodríguez", room: "105", alertColor: "2", priority: "Media", lastUpdate: "2024-10-01 10:30" },
        { name: "Sofía Fernández", room: "106", alertColor: "0", priority: "Baja", lastUpdate: "2024-10-01 09:00" },
        { name: "Miguel Torres", room: "107", alertColor: "1", priority: "Alta", lastUpdate: "2024-10-01 12:00" },
        { name: "Laura Ramírez", room: "108", alertColor: "2", priority: "Media", lastUpdate: "2024-10-01 11:45" },
        { name: "Diego Sánchez", room: "109", alertColor: "3    ", priority: "Baja", lastUpdate: "2024-10-01 08:30" },
    ];

    return (
        <div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 p-4 sm:p-10">
                <InfoCard
                    icon={BriefcaseMedical}
                    title="Pacientes Asignados"
                    description="10 Pacientes"
                    actionText="Ver Detalles"
                    onActionClick={() => {}}
                />
                <InfoCard
                    icon={Siren}
                    title="Alertas Activas"
                    description="5 Alertas"
                    actionText="Ver Alertas"
                    onActionClick={() => {}}
                />
                <InfoCard
                    icon={ClipboardClock}
                    title="Procedimientos Pendientes"
                    description="8 Procedimientos"
                    actionText="Ver Procedimientos"
                    onActionClick={() => {}}
                />
            </div>
            <PatientTable className="font-sans" data={patientsData} />
        </div>
    );
}
