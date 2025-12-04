import { memo, useEffect, useState } from "react";
import { cn } from "../../../../core/utils/cn";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/globals/spinner";
import { renderToStaticMarkup } from "react-dom/server";
import { diagnosticService } from "../../../../core/services/diagnosticService";
import { documentsService } from "../../../../core/services/documentsService";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
    Pill,
    Clock,
    FileUp,
    UploadCloud,
    CheckCircle,
    AlertTriangle
} from "lucide-react";

const MySwal = withReactContent(Swal);

// Convierte un icono de lucide-react a SVG crudo para usar en SweetAlert
const iconToSvg = (Icon: any, classes: string = "h-6 w-6") => {
    return renderToStaticMarkup(<Icon className={classes} />);
};


interface Diagnostic {
    id: string;
    title: string;
    diagnosis: string;
    createdAt: string;
}

interface Props {
    patientId?: string | null;
    className?: string;
}

export const DocumentDiagnosticList = memo(function DocumentDiagnosticList({
    patientId,
    className,
}: Props) {

    const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
    const [loadingDiagnostics, setLoadingDiagnostics] = useState(true);

    // ================================
    // CARGAR DIAGNÓSTICOS
    // ================================
    useEffect(() => {
        if (!patientId) return;

        const fetchDiagnostics = async () => {
            try {
                const data = await diagnosticService.getDiagnosticsByPatientId(patientId);
                setDiagnostics(data.data || []);
            } catch (err) {
                console.error("Error cargando diagnósticos:", err);
            } finally {
                setLoadingDiagnostics(false);
            }
        };

        fetchDiagnostics();
    }, [patientId]);


    // ================================
    // SWEET ALERT PARA SUBIR ARCHIVOS
    // ================================
    const handleUploadClick = async (diag: Diagnostic) => {

    const swal = await MySwal.fire({
        title: `
            <div class="flex items-center gap-2 justify-center text-slate-700">
                ${iconToSvg(FileUp, "h-6 w-6 text-orange-600")}
                <span>Subir documento</span>
            </div>
        `,
        html: `
            <div class="text-slate-700 font-medium mb-3 text-left">
                Diagnóstico seleccionado:
                <div class="mt-1 text-slate-900 font-semibold">${diag.title}</div>
            </div>

            <div class="p-3 rounded-lg border border-orange-200 bg-orange-50 flex items-center gap-3 mb-4">
                ${iconToSvg(UploadCloud, "h-6 w-6 text-orange-600")}
                <span class="text-sm text-slate-700">
                    Selecciona uno o varios archivos (.pdf, .jpg, .png)
                </span>
            </div>

            <input 
                type="file" 
                id="swal-file-input" 
                class="swal2-file" 
                multiple 
                accept=".pdf, .jpg, .jpeg, .png"
            />
        `,
        showCancelButton: true,
        confirmButtonText: "Subir archivo(s)",
        cancelButtonText: "Cancelar",
        buttonsStyling: false,
        customClass: {
            popup: "rounded-xl shadow-xl border border-orange-200",
            confirmButton:
                "bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-semibold mx-2",
            cancelButton:
                "bg-gray-200 hover:bg-gray-300 text-slate-700 px-4 py-2 rounded-md font-semibold mx-2",
        },
        preConfirm: () => {
            const input = document.getElementById("swal-file-input") as HTMLInputElement;

            if (!input?.files || input.files.length === 0) {
                Swal.showValidationMessage("Debes seleccionar al menos un archivo.");
                return false;
            }

            return Array.from(input.files);
        }
    });

    if (!swal.isConfirmed) return;

    const selectedFiles = swal.value as File[];

    Swal.fire({
        title: "Subiendo documentos...",
        html: `<p class="text-slate-600 mt-2">Por favor espera un momento.</p>`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });

    try {

        console.log(patientId,diag.id);
        

        await documentsService.uploadDocuments({
            patientId: patientId!,
            diagnosticId: diag.id,
            files: selectedFiles,
        });

        Swal.fire({
            iconHtml: iconToSvg(CheckCircle, "h-10 w-10 text-green-600"),
            title: "Documento subido",
            text: "Los documentos se han subido correctamente.",
            customClass: {
                popup: "rounded-xl border border-green-200 shadow-lg",
            }
        });

    } catch (error: any) {

        Swal.fire({
            iconHtml: iconToSvg(AlertTriangle, "h-10 w-10 text-red-600"),
            title: "Error al subir",
            text: error?.response?.data?.message || "Ocurrió un error al subir el archivo.",
            customClass: {
                popup: "rounded-xl border border-red-200 shadow-lg",
            }
        });
    }
};


    // ================================
    // RENDER DEL COMPONENTE
    // ================================
    return (
        <Card
            className={cn(
                "border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50/30",
                className
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Pill className="h-5 w-5 text-orange-600" />
                        Documentos
                    </CardTitle>

                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Activo
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">

                {loadingDiagnostics ? (
                    <div className="flex justify-center py-6">
                        <Spinner size="lg" />
                    </div>
                ) : diagnostics.length === 0 ? (
                    <p className="text-muted-foreground text-center">
                        Este paciente aún no tiene diagnósticos registrados.
                    </p>
                ) : (
                    diagnostics.map((diag) => (
                        <div
                            key={diag.id}
                            className="flex justify-between items-center p-4 bg-white/70 border border-orange-200 rounded-lg shadow-sm"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">
                                    {diag.title}
                                </span>

                                <span className="text-sm text-slate-600">
                                    {diag.diagnosis}
                                </span>

                                <span className="text-xs text-slate-400 mt-1">
                                    {new Date(diag.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <Button
                                variant="secondary"
                                rightIcon={<FileUp size={18} />}
                                onClick={() => handleUploadClick(diag)}
                            >
                                Subir documento
                            </Button>
                        </div>
                    ))
                )}

            </CardContent>
        </Card>
    );
});

