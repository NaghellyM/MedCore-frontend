import { useEffect, useState } from "react";
import { documentsService } from "../../../../core/services/documentsService";
import { FileText, Image as ImageIcon, Download, Trash2, Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useCurrentUser } from "../../../../core/hooks/auth/useCurrentUser";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import { PatientSidebar } from "../components/patientSidebar";

const MySwal = withReactContent(Swal);

interface PatientDocument {
    id: string;
    filename: string;
    fileType: string;
    fileSize: number;
    currentVersion: number;
    createdAt: string;
    diagnostic?: {
        title: string;
    };
}

export function PatientDocuments() {
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser();
    const patientId = user?.id;

    const [documents, setDocuments] = useState<PatientDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (patientId) {
            loadDocuments();
        }
    }, [patientId]);

    const loadDocuments = async () => {
        try {
            const res = await documentsService.getDocumentsByPatientId(patientId!);
            setDocuments(res?.data?.data || []);
        } catch (err: any) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "Error al cargar documentos",
                text: err?.response?.data?.message || "Intenta nuevamente.",
            });
        } finally {
            setLoading(false);
        }
    };

    const download = async (doc: PatientDocument) => {
        try {
            const res = await documentsService.downloadDocument(doc.id);

            const blob = res.data;
            const url = window.URL.createObjectURL(blob);

            const contentType = res.headers["content-type"];
            const extension = contentType ? contentType.split("/")[1] : doc.fileType;

            const a = document.createElement("a");
            a.href = url;
            a.download = doc.filename || `documento.${extension}`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("DOWNLOAD ERROR", err);
            MySwal.fire({
                icon: "error",
                title: "Error al descargar",
                text: "Intentar nuevamente",
            });
        }
    };

    const deleteDocument = async (doc: PatientDocument) => {
        const confirm = await MySwal.fire({
            icon: "warning",
            title: "¿Eliminar documento?",
            text: `Eliminarás "${doc.filename}". Esta acción no se puede deshacer.`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await documentsService.deleteDocument(doc.id);
            setDocuments((prev) => prev.filter((d) => d.id !== doc.id));

            MySwal.fire({
                icon: "success",
                title: "Documento eliminado",
            });
        } catch (err) {
            console.error(err);
            MySwal.fire({
                icon: "error",
                title: "No se pudo eliminar",
            });
        }
    };

    // Estado de carga del usuario
    if (userLoading) {
        return (
            <DashboardLayout
                sidebar={<PatientSidebar />}
                showSearch={false}
                headerHeightClass="pt-[80px]"
                contentMaxWidthClass="max-w-5xl"
                variant="inset"
                collapsible="icon"
            >
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    // Usuario no autenticado
    if (!isAuthenticated || !patientId) {
        return (
            <DashboardLayout
                sidebar={<PatientSidebar />}
                showSearch={false}
                headerHeightClass="pt-[80px]"
                contentMaxWidthClass="max-w-5xl"
                variant="inset"
                collapsible="icon"
            >
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-lg text-muted-foreground">Debes iniciar sesión para ver tus documentos.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (loading) {
        return (
            <DashboardLayout
                sidebar={<PatientSidebar />}
                showSearch={false}
                headerHeightClass="pt-[80px]"
                contentMaxWidthClass="max-w-5xl"
                variant="inset"
                collapsible="icon"
            >
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-muted-foreground">Cargando documentos...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (documents.length === 0) {
        return (
            <DashboardLayout
                sidebar={<PatientSidebar />}
                showSearch={false}
                headerHeightClass="pt-[80px]"
                contentMaxWidthClass="max-w-5xl"
                variant="inset"
                collapsible="icon"
            >
                <div className="w-full">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                        📁 Documentos del Paciente
                    </h2>
                    <p className="text-center text-muted-foreground italic">No hay documentos registrados.</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            sidebar={<PatientSidebar />}
            showSearch={false}
            headerHeightClass="pt-[80px]"
            contentMaxWidthClass="max-w-5xl"
            variant="inset"
            collapsible="icon"
        >
            <div className="w-full">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                    📁 Documentos del Paciente
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-card rounded-xl shadow-md p-4 border border-border hover:shadow-lg transition"
                        >
                            {/* HEADER */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {doc.fileType === "pdf" ? (
                                        <FileText className="w-8 h-8 text-destructive" />
                                    ) : (
                                        <ImageIcon className="w-8 h-8 text-info" />
                                    )}

                                    <div>
                                        <p className="font-semibold text-foreground">{doc.filename}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Versión: {doc.currentVersion}
                                        </p>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => download(doc)}
                                        className="bg-info hover:bg-info/90 text-info-foreground p-2 rounded-lg transition"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => deleteDocument(doc)}
                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground p-2 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* FOOTER INFO */}
                            <div className="mt-4 text-sm">
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">Diagnóstico:</span>{" "}
                                    {doc.diagnostic?.title}
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">Subido:</span>{" "}
                                    {new Date(doc.createdAt).toLocaleString()}
                                </p>
                                <p className="text-muted-foreground">
                                    <span className="font-semibold text-foreground">Tamaño:</span>{" "}
                                    {(doc.fileSize / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
