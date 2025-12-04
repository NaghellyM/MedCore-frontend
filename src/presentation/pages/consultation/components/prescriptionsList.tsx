import { memo } from "react";
import { cn } from "../../../../core/utils/cn";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";

import { prescriptionService } from "../../../../core/services/prescriptionService";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { renderToStaticMarkup } from "react-dom/server";

import {
    Pill,
    Plus,
    Trash2,
    CheckCircle,
    AlertTriangle,
    ClipboardPlus
} from "lucide-react";

const MySwal = withReactContent(Swal);

// Convierte íconos → SVG para swal2
const iconToSvg = (Icon: any, classes = "h-6 w-6") =>
    renderToStaticMarkup(<Icon className={classes} />);

interface Diagnostic {
    id: string;
    title: string;
    diagnosis?: string;
    consultDate: string;
    state: string;
}

interface Props {
    patientId?: string | null;
    diagnostics?: Diagnostic[];
    className?: string;
}

export const PrescriptionsList = memo(function PrescriptionsList({
    patientId,
    diagnostics = [],
    className,
}: Props) {

    // ====================================================
    // FORMULARIO — RECIBE OPCIONALMENTE diagnosticId
    // ====================================================
    const openPrescriptionForm = async (diagnosticId?: string) => {

        const html = `
            <div class="text-left space-y-5">

                <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div class="font-semibold text-slate-700 flex items-center gap-2">
                        ${iconToSvg(Pill, "h-5 w-5 text-orange-600")}
                        Nueva Prescripción Médica
                    </div>
                    <p class="text-xs text-slate-500 mt-1">
                        Agrega varios medicamentos, alergias y notas.
                    </p>
                </div>

                <div>
                    <label class="font-semibold text-sm text-slate-700">Notas</label>
                    <textarea id="notes" class="swal2-textarea" rows="3"></textarea>
                </div>

                <div>
                    <label class="font-semibold text-sm text-slate-700">Alergias</label>
                    <input id="allergies" class="swal2-input" placeholder="Ej: penicilina"/>
                </div>

                <div id="medications-container" class="space-y-4"></div>

                <button id="add-med"
                    class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2">
                    ${iconToSvg(Plus, "h-5 w-5")}
                    Agregar medicamento
                </button>
            </div>
        `;

        const swal = await MySwal.fire({
            title: `
                <div class="flex items-center justify-center gap-2 text-slate-700">
                    ${iconToSvg(ClipboardPlus, "h-6 w-6 text-orange-600")}
                    Crear Prescripción
                </div>
            `,
            html,
            width: "720px",
            showCancelButton: true,
            confirmButtonText: "Enviar Prescripción",
            cancelButtonText: "Cancelar",
            buttonsStyling: false,
            customClass: {
                popup: "rounded-xl border border-orange-200",
                confirmButton:
                    "bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-semibold mx-2",
                cancelButton:
                    "bg-gray-200 hover:bg-gray-300 text-slate-700 px-4 py-2 rounded-md font-semibold mx-2",
            },

            didOpen: () => {
                const container = document.getElementById("medications-container")!;
                const addBtn = document.getElementById("add-med")!;

                const addMedicationForm = () => {
                    const id = Date.now();
                    const div = document.createElement("div");
                    div.className =
                        "p-4 border border-slate-200 bg-white rounded-lg shadow-sm relative space-y-3";
                    div.setAttribute("data-id", String(id));

                    div.innerHTML = `
                        <button class="absolute top-2 right-2 text-red-500 hover:text-red-700 remove-med">
                            ${iconToSvg(Trash2, "h-5 w-5")}
                        </button>

                        <input class="swal2-input" placeholder="Nombre del medicamento" data-field="name"/>
                        <input class="swal2-input" placeholder="Ingrediente activo" data-field="ingredient"/>
                        <input class="swal2-input" placeholder="Dosis (Ej: 500mg)" data-field="dosage"/>
                        <input class="swal2-input" placeholder="Frecuencia (Ej: Cada 8h)" data-field="frequency"/>

                        <div class="flex gap-2">
                            <input type="number" class="swal2-input" style="width:50%" placeholder="Duración" data-field="duration"/>
                            <select class="swal2-select" data-field="durationType" style="width:50%">
                                <option value="días">Días</option>
                                <option value="semanas">Semanas</option>
                                <option value="meses">Meses</option>
                            </select>
                        </div>

                        <input class="swal2-input" placeholder="Instrucciones" data-field="instructions"/>
                        <input class="swal2-input" placeholder="Advertencias" data-field="warnings"/>
                    `;

                    div.querySelector(".remove-med")!.addEventListener("click", () => div.remove());

                    container.appendChild(div);
                };

                addMedicationForm();
                addBtn.addEventListener("click", () => addMedicationForm());
            },

            preConfirm: () => {
                const getValue = (id: string) =>
                    (document.getElementById(id) as HTMLInputElement)?.value;

                const blocks = Array.from(document.querySelectorAll("[data-id]"));

                if (blocks.length === 0)
                    return Swal.showValidationMessage("Debes agregar al menos un medicamento.");

                const medications = blocks.map((block: any) => {
                    const f = (field: string) =>
                        (block.querySelector(`[data-field="${field}"]`) as HTMLInputElement)?.value;

                    return {
                        medicationName: f("name"),
                        activeIngredient: f("ingredient"),
                        dosage: f("dosage"),
                        frequency: f("frequency"),
                        duration: Number(f("duration")),
                        durationType: f("durationType"),
                        instructions: f("instructions") || "",
                        warnings: f("warnings") || "",
                    };
                });

                return {
                    notes: getValue("notes"),
                    allergies: getValue("allergies")
                        ?.split(",")
                        ?.map((x) => x.trim())
                        ?.filter((x) => x),
                    medications,
                };
            },
        });

        if (!swal.isConfirmed) return;

        const payload = {
            patientId: patientId!,
            diagnosticId: diagnosticId || undefined,
            notes: swal.value.notes,
            allergies: swal.value.allergies,
            medications: swal.value.medications,
        };

        Swal.fire({ title: "Enviando...", didOpen: () => Swal.showLoading() });

        try {
            await prescriptionService.createPrescription(payload);

            Swal.fire({
                iconHtml: iconToSvg(CheckCircle, "h-10 w-10 text-green-600"),
                title: "Prescripción enviada",
                text: "La prescripción fue creada exitosamente.",
            });
        } catch (err: any) {
            Swal.fire({
                iconHtml: iconToSvg(AlertTriangle, "h-10 w-10 text-red-600"),
                title: "Error al enviar",
                text: err?.response?.data?.message || "Ocurrió un error inesperado.",
            });
        }
    };

    // ====================================================
    // RENDER
    // ====================================================
    return (
        <Card
            className={cn(
                "border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50/30",
                className
            )}
        >
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Pill className="h-5 w-5 text-orange-600" />
                    Prescripciones
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

                {/* ======================= */}
                {/*   LISTA DE DIAGNOSTICOS */}
                {/* ======================= */}
                {diagnostics.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-700">
                            Diagnósticos del paciente
                        </p>

                        {diagnostics.map((d) => (
                            <div
                                key={d.id}
                                className="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium">{d.title}</p>
                                    <p className="text-sm text-slate-600">{d.diagnosis}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(d.consultDate).toLocaleDateString()}
                                    </p>
                                </div>

                                <Button
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                    onClick={() => openPrescriptionForm(d.id)}
                                >
                                    Prescribir
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {/* ======================= */}
                {/*   BOTÓN NORMAL GENERAL  */}
                {/* ======================= */}
                <div className="text-center pt-4">
                    <Button
                        variant="secondary"
                        className="px-6 py-3 text-md font-semibold"
                        rightIcon={<ClipboardPlus size={18} />}
                        onClick={() => openPrescriptionForm(undefined)}
                    >
                        Crear Prescripción
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
});
