import { PatientTable } from "../components/nurseTable";
import { InfoCard } from "../../../components/globals/sectionCard";
import { BriefcaseMedical, Siren, ClipboardClock } from "lucide-react";

export function NursePageContent() {
    const patientsData = [
        { name: "Juan Pérez", room: "101", alert: "0"  , priority: "Baja", lastUpdate: "2024-10-01 10:00" },
        { name: "María Gómez", room: "102", alert: "1", priority: "Baja", lastUpdate: "2024-10-01 09:30" },
        { name: "Carlos López", room: "103", alert: "3", priority: "Alta", lastUpdate: "2024-10-01 08:45" },
        { name: "Ana Martínez", room: "104", alert: "0", priority: "Baja", lastUpdate: "2024-10-01 11:15" },
        { name: "Luis Rodríguez", room: "105", alert: "2", priority: "Media", lastUpdate: "2024-10-01 10:30" },
        { name: "Sofía Fernández", room: "106", alert: "0", priority: "Baja", lastUpdate: "2024-10-01 09:00" },
        { name: "Miguel Torres", room: "107", alert: "1", priority: "Baja", lastUpdate: "2024-10-01 12:00" },
        { name: "Laura Ramírez", room: "108", alert: "2", priority: "Media", lastUpdate: "2024-10-01 11:45" },
        { name: "Diego Sánchez", room: "109", alert: "3", priority: "Alta", lastUpdate: "2024-10-01 08:30" },
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
                    title="Pendientes"
                    description="8 Procedimientos"
                    actionText="Ver Procedimientos"
                    onActionClick={() => {}}
                />
            </div>
            <PatientTable className="font-sans justify-center" data={patientsData} />
        </div>
    );
}
