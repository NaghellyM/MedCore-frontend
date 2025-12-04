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

interface Props {
    patientId?: string | null;
    className?: string;
}

export const PrescriptionsList = memo(function PrescriptionsList({
    patientId,
    className,
}: Props) {

    // ====================================================
    // FORMULARIO — CREAR PRESCRIPCIÓN COMPLETA
    // ====================================================
    const openPrescriptionForm = async () => {

        const html = `
            <div class="text-left space-y-5">

                <!-- Encabezado -->
                <div class="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div class="font-semibold text-slate-700 flex items-center gap-2">
                        ${iconToSvg(Pill, "h-5 w-5 text-orange-600")}
                        Nueva Prescripción Médica
                    </div>
                    <p class="text-xs text-slate-500 mt-1">
                        Agrega varios medicamentos, alergias y notas. Todo es validado automáticamente.
                    </p>
                </div>

                <!-- Notas -->
                <div>
                    <label class="font-semibold text-sm text-slate-700">Notas (opcional)</label>
                    <textarea id="notes" class="swal2-textarea" rows="3" placeholder="Observaciones, recomendaciones, etc."></textarea>
                </div>

                <!-- Alergias -->
                <div>
                    <label class="font-semibold text-sm text-slate-700">Alergias del paciente (opcional)</label>
                    <input id="allergies" class="swal2-input" placeholder="Ej: penicilina, sulfas..."/>
                </div>

                <!-- Lista dinámica de medicamentos -->
                <div id="medications-container" class="space-y-4"></div>

                <!-- Botón agregar medicamento -->
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
                    div.className = "p-4 border border-slate-200 bg-white rounded-lg shadow-sm relative space-y-3";
                    div.setAttribute("data-id", String(id));

                    div.innerHTML = `
                        <button class="absolute top-2 right-2 text-red-500 hover:text-red-700 remove-med">
                            ${iconToSvg(Trash2, "h-5 w-5")}
                        </button>

                        <input class="swal2-input" placeholder="Nombre del medicamento" data-field="name"/>
                        <input class="swal2-input" placeholder="Ingrediente activo" data-field="ingredient"/>
                        <input class="swal2-input" placeholder="Dosis (ej: 500mg)" data-field="dosage"/>
                        <input class="swal2-input" placeholder="Frecuencia (ej: Cada 8 horas)" data-field="frequency"/>

                        <div class="flex gap-2">
                            <input type="number" class="swal2-input" style="width:50%" placeholder="Duración" data-field="duration"/>
                            <select class="swal2-select" data-field="durationType" style="width:50%">
                                <option value="días">Días</option>
                                <option value="semanas">Semanas</option>
                                <option value="meses">Meses</option>
                            </select>
                        </div>

                        <select class="swal2-select" data-field="type">
                            <option value="">Tipo (opcional)</option>
                            <option value="antibiotico">Antibiótico</option>
                            <option value="antiinflamatorio">Antiinflamatorio</option>
                            <option value="analgesico">Analgésico</option>
                            <option value="antihipertensivo">Antihipertensivo</option>
                            <option value="anticoagulante">Anticoagulante</option>
                            <option value="vitamina">Vitamina</option>
                            <option value="antidiabetico">Antidiabético</option>
                        </select>

                        <input class="swal2-input" placeholder="Instrucciones (opcional)" data-field="instructions"/>
                        <input class="swal2-input" placeholder="Advertencias (opcional)" data-field="warnings"/>
                    `;

                    div.querySelector(".remove-med")!.addEventListener("click", () => div.remove());

                    container.appendChild(div);
                };

                addMedicationForm(); // uno por defecto
                addBtn.addEventListener("click", () => addMedicationForm());
            },

            preConfirm: () => {
                const getValue = (id: string) =>
                    (document.getElementById(id) as HTMLInputElement)?.value;

                const blocks = Array.from(document.querySelectorAll("[data-id]"));

                if (blocks.length === 0) {
                    return Swal.showValidationMessage("Debes agregar al menos un medicamento.");
                }

                const medications = blocks.map((block: any) => {
                    const f = (field: string) =>
                        (block.querySelector(`[data-field="${field}"]`) as HTMLInputElement)?.value;

                    if (!f("name") || !f("ingredient") || !f("dosage")) {
                        return Swal.showValidationMessage(
                            "Cada medicamento debe tener nombre, ingrediente activo y dosis."
                        );
                    }

                    if (Number(f("duration")) < 1) {
                        return Swal.showValidationMessage(
                            "La duración debe ser mayor o igual a 1."
                        );
                    }

                    return {
                        medicationName: f("name"),
                        activeIngredient: f("ingredient"),
                        dosage: f("dosage"),
                        frequency: f("frequency"),
                        duration: Number(f("duration")),
                        durationType: f("durationType"),
                        instructions: f("instructions") || "",
                        warnings: f("warnings") || "",
                        medicationType: f("type") || "", // 🔥 NECESARIO PARA EL BACKEND
                    };
                });

                return {
                    notes: getValue("notes"),
                    allergies: getValue("allergies")
                        ?.split(",")
                        ?.map((a) => a.trim())
                        .filter((a) => a),
                    medications,
                };
            },
        });

        if (!swal.isConfirmed) return;

        const payload = {
            patientId: patientId!,
            medications: swal.value.medications,
            notes: swal.value.notes || undefined,
            allergies: swal.value.allergies || undefined,
        };

        Swal.fire({
            title: "Enviando prescripción...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

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
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Pill className="h-5 w-5 text-orange-600" />
                        Prescripciones
                    </CardTitle>

                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                        Activo
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="py-6 text-center">
                <Button
                    variant="secondary"
                    className="px-6 py-3 text-md font-semibold"
                    rightIcon={<ClipboardPlus size={18} />}
                    onClick={openPrescriptionForm}
                >
                    Crear Prescripción
                </Button>
            </CardContent>
        </Card>
    );
});