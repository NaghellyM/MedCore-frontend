import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

type Encounter = {
    id: string;
    patientName: string;
    document: string;
    type: "teleconsulta" | "consulta-presencial" | string;
    doctor: string;
    createdAt?: string;
    updatedAt?: string;
};

const STORAGE_KEY = "encounters";

function loadEncounters(): Encounter[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
        return [];
    }
}

export default function EncounterPreviewPage() {
    const [query, setQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [items, setItems] = useState<Encounter[]>([]);

    useEffect(() => {
        const sync = () => setItems(loadEncounters());
        sync();
        window.addEventListener("focus", sync);
        return () => window.removeEventListener("focus", sync);
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items
            .filter((e) => (typeFilter === "all" ? true : e.type === typeFilter))
            .filter((e) =>
                q
                    ? [e.patientName, e.document, e.doctor]
                        .filter(Boolean)
                        .some((v) => String(v).toLowerCase().includes(q))
                    : true
            )
            .sort((a, b) => {
                const da = new Date(b.updatedAt || b.createdAt || 0).getTime();
                const db = new Date(a.updatedAt || a.createdAt || 0).getTime();
                return da - db;
            });
    }, [items, query, typeFilter]);
    const navigate = useNavigate();


    return (
        <DashboardLayout
            sidebar={<DoctorSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            variant="inset"
            collapsible="icon"
            mainClassName="pb-10"
        >
            <div className="pt-10 mx-auto max-w-6xl px-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Consultas médicas</h1>
                    <Button
                        className="btn"
                        onClick={() => navigate("/encounter/new")}
                    >
                        Crear nueva consulta
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    <Input
                        placeholder="Buscar por paciente, documento o médico…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            <SelectItem value="teleconsulta">Teleconsulta</SelectItem>
                            <SelectItem value="consulta-presencial">Consulta Presencial</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => { setQuery(""); setTypeFilter("all"); }}>
                        Limpiar filtros
                    </Button>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-slate-500">
                        {items.length === 0 ? (
                            <>
                                No hay consultas creadas aún.<br />Crea tu primera consulta para verla aquí.
                            </>
                        ) : (
                            <>No hay resultados con los filtros actuales.</>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map((e) => (
                            <div
                                key={e.id}
                                className="rounded-2xl border shadow-sm p-4 bg-white hover:shadow-md transition cursor-pointer"
                                onClick={() => navigate(`/encounters/edit/${e.id}`)}
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="font-medium text-lg truncate">
                                        {e.patientName || "Paciente sin nombre"}
                                    </div>
                                    <span
                                        className={
                                            `text-xs rounded-full px-2 py-1 border whitespace-nowrap font-bold ` +
                                            (e.type === "teleconsulta"
                                                ? "bg-green-100 text-green-800 border-green-200"
                                                : "bg-yellow-100 text-yellow-600 border-yellow-200")
                                        }
                                    >
                                        {e.type === "teleconsulta" ? "Teleconsulta" : "Consulta presencial"}
                                    </span>

                                </div>

                                <div className="text-sm text-slate-600 space-y-1">
                                    <div><span className="font-medium">Documento:</span> {e.document || "—"}</div>
                                    <div><span className="font-medium">Médico:</span> {e.doctor || "—"}</div>
                                    <div className="text-xs text-slate-500">
                                        {e.updatedAt || e.createdAt
                                            ? `Actualizado: ${new Date(e.updatedAt || e.createdAt!).toLocaleString()}`
                                            : "Sin fecha"}
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        className="btn"
                                        variant="outline"
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            navigate(`/encounter/edit/${e.id}`);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            navigate(`/encounter/${e.id}`);
                                        }}
                                        className="font-bold bg-slate-300"
                                    >
                                        Ver detalle
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
