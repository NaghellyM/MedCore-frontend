import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/layout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import BackButton from "../components/button";

type Encounter = {
    id: string;
    patientName: string;
    document: string;
    type: "teleconsulta" | "consulta-presencial" | string;
    doctor: string;
    dateTime?: string;      
    createdAt?: string;
    updatedAt?: string;
};

const STORAGE_KEY = "encounters";

function getEncounterByIdLocal(id: string): Encounter | null {
    try {
        const list: Encounter[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return list.find((e) => e.id === id) || null;
    } catch {
        return null;
    }
}

function fmtDateTime(value?: string) {
    if (!value) return "—";
    try {
        return new Date(value).toLocaleString();
    } catch {
        return value;
    }
}

export default function EncounterDetailPage() {
    const { id = "" } = useParams();
    const [loading, setLoading] = useState(true);
    const [encounter, setEncounter] = useState<Encounter | null>(null);

    useEffect(() => {
        setLoading(true);
        const data = getEncounterByIdLocal(id);
        setEncounter(data);
        setLoading(false);
    }, [id]);

    return (
        <DashboardLayout
            sidebar={<DoctorSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            variant="inset"
            collapsible="icon"
            mainClassName="pb-10"
        >
            <div className="pt-10 mx-auto max-w-3xl px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Detalle de consulta</h1>
                    <BackButton />
                </div>

                {loading ? (
                    <div className="rounded-xl border p-6">Cargando…</div>
                ) : !encounter ? (
                    <div className="rounded-xl border p-6 text-red-600">
                        No se encontró la consulta con id: <b>{id}</b>
                    </div>
                ) : (
                    <div className="rounded-2xl border shadow-sm bg-white">
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <div className="text-sm text-slate-500">Paciente</div>
                                <div className="text-base font-medium">
                                    {encounter.patientName || "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-slate-500">Documento</div>
                                <div className="text-base font-medium">
                                    {encounter.document || "—"}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-slate-500">Tipo de consulta</div>
                                <div className="text-base font-medium">
                                    {encounter.type === "teleconsulta"
                                        ? "Teleconsulta"
                                        : encounter.type === "consulta-presencial"
                                            ? "Consulta presencial"
                                            : (encounter.type || "—")}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-slate-500">Médico</div>
                                <div className="text-base font-medium">
                                    {encounter.doctor || "—"}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <div className="text-sm text-slate-500">Fecha y hora</div>
                                <div className="text-base font-medium">
                                    {fmtDateTime(encounter.dateTime)}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                            <div>
                                <span className="text-slate-500">Creado:</span>{" "}
                                {fmtDateTime(encounter.createdAt)}
                            </div>
                            <div>
                                <span className="text-slate-500">Actualizado:</span>{" "}
                                {fmtDateTime(encounter.updatedAt)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
