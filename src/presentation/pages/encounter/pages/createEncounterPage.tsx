import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../../doctor/components/doctorSideBar";
import EncounterForm from "../components/encounterForm";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function createEncounterLocal(payload: any) {
    const KEY = "encounters";
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    const id =
        (typeof crypto !== "undefined" && "randomUUID" in crypto && crypto.randomUUID()) ||
        `${Date.now()}`;
    const record = { id, ...payload, createdAt: new Date().toISOString() };
    list.push(record);
    localStorage.setItem(KEY, JSON.stringify(list));
    return record;
}

export default function CreateEncounterPage() {
    const navigate = useNavigate();

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
                <EncounterForm
                    submitLabel="Crear consulta"
                    onSubmit={async (values) => {
                        try {
                            const created = createEncounterLocal(values);
                            await Swal.fire({
                                icon: "success",
                                title: "Consulta creada",
                                text: "La consulta se guardó correctamente.",
                                confirmButtonText: "Continuar",
                            });
                            navigate(`/encounter/${created.id}`);

                        } catch (err) {
                            Swal.fire({
                                icon: "error",
                                title: "No se pudo crear",
                                text: "Ocurrió un problema guardando la consulta.",
                            });
                        }
                    }}
                />
            </div>
        </DashboardLayout>
    );
}
