import { useEffect, useState } from "react";
import { useNavigate, useParams /*, useNavigate */ } from "react-router-dom";
import { DashboardLayout } from "../../../layouts/layout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import EncounterForm from "../components/encounterForm";
import Swal from "sweetalert2";

const STORAGE_KEY = "encounters";

function getEncounterByIdLocal(id: string) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return list.find((e: any) => e.id === id) || null;
}

function updateEncounterLocal(id: string, payload: any) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const idx = list.findIndex((e: any) => e.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...payload, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updated;
}

export default function EditEncounterPage() {
    const navigate = useNavigate();
    const { id = "" } = useParams();
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLoading(true);
        const data = getEncounterByIdLocal(id);
        setInitialValues(
            data
                ? {
                    patientName: data.patientName ?? "",
                    document: data.document ?? "",
                    type: data.type ?? "",
                    doctor: data.doctor ?? "",
                    dateTime: data.dateTime ?? "",
                }
                : null
        );
        setLoading(false);
    }, [id]);

    return (
        <DashboardLayout
            sidebar={<DoctorSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            variant="inset"
            collapsible="icon"
            mainClassName="pb-10 "
        >
            <div className="justify-center items-center pt-20 ">
                {loading ? (
                    <div className="px-6">Cargando consulta…</div>
                ) : !initialValues ? (
                    <div className="px-6 text-red-600">
                        No se encontró la consulta con id: <b>{id}</b>
                    </div>
                ) : (
                    <EncounterForm
                        title={`Editar consulta`}
                        initialValues={initialValues}
                        submitLabel={saving ? "Guardando…" : "Guardar cambios"}
                        onSubmit={async (values) => {
                            try {
                                setSaving(true);
                                const updated = updateEncounterLocal(id, values);

                                if (updated) {
                                    await Swal.fire({
                                        icon: "success",
                                        title: "Consulta actualizada",
                                        text: "Los cambios se guardaron correctamente.",
                                        confirmButtonText: "Aceptar",
                                    });
                                    navigate(`/encounter/${id}`);
                                } else {
                                    await Swal.fire({
                                        icon: "error",
                                        title: "No se pudo actualizar",
                                        text: "No encontramos la consulta a actualizar.",
                                    });
                                }
                            } catch (e) {
                                await Swal.fire({
                                    icon: "error",
                                    title: "Error inesperado",
                                    text: "Ocurrió un problema guardando los cambios.",
                                });
                            } finally {
                                setSaving(false);
                            }
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
