import { useEffect, useState } from "react";
import { documentsService } from "../../../../core/services/documentsService";
import { FileText, Image as ImageIcon, Download, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function PatientDocumentsList({ patientId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  patientId = "69090372f2a08c7fe006739a";

  useEffect(() => {
    loadDocuments();
  }, [patientId]);

  const loadDocuments = async () => {
    try {
      const res = await documentsService.getDocumentsByPatient(patientId);
      setDocuments(res?.data?.data || []);
    } catch (err) {
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

  const download = async (doc) => {
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

  const deleteDocument = async (doc) => {
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

  if (loading) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Cargando documentos...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No hay documentos registrados.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-sky-700 mb-6 flex items-center gap-2">
        📁 Documentos del Paciente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl shadow-md p-4 border border-sky-100 hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {doc.fileType === "pdf" ? (
                  <FileText className="w-8 h-8 text-red-500" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-sky-500" />
                )}

                <div>
                  <p className="font-semibold text-gray-700">{doc.filename}</p>
                  <p className="text-xs text-gray-500">
                    Versión: {doc.currentVersion}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => download(doc)}
                  className="bg-sky-600 text-white p-2 rounded-lg hover:bg-sky-700 transition"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteDocument(doc)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FOOTER INFO */}
            <div className="mt-4 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold">Diagnóstico:</span>{" "}
                {doc.diagnostic?.title}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Subido:</span>{" "}
                {new Date(doc.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Tamaño:</span>{" "}
                {(doc.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
