import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Upload, FileText, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { documentsService } from "../../../../core/services/documentsService"; // Temporalmente deshabilitado

const MySwal = withReactContent(Swal);

export default function UploadDiagnosticDocument() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    
    const selected = Array.from(fileList);

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setError("Tipo de archivo no permitido. Solo PDF, JPG, PNG.");
        return;
      }
      if (file.size > maxSize) {
        setError("El archivo supera el tamaño máximo de 10MB.");
        return;
      }
    }

    setError("");
    setFiles(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ TEMPORALMENTE DESHABILITADO - Este componente tiene valores quemados
    MySwal.fire({
      icon: "warning",
      title: "Función no disponible",
      text: "Esta función está siendo refactorizada. Use la carga de documentos desde el formulario de historia médica.",
    });
    return;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-2xl shadow-2xl rounded-3xl p-6 bg-white/60 backdrop-blur-lg border border-white/50">
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg mb-3">
                <Stethoscope className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold text-blue-700 text-center">
                Subir Documento Médico
              </h1>
              <p className="text-center text-blue-900/80 mt-2 text-sm">
                Adjunta documentos relacionados al diagnóstico del paciente.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label
                htmlFor="fileInput"
                className="border-2 border-dashed border-blue-300 rounded-3xl p-8 flex flex-col items-center
                bg-blue-50/40 hover:bg-blue-100/40 transition cursor-pointer"
              >
                <Upload className="w-14 h-14 text-blue-500 mb-3" />
                <p className="text-blue-700 text-sm font-medium">
                  Selecciona un archivo (PDF, JPG, PNG)
                </p>

                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />

                <span className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-xl cursor-pointer hover:bg-blue-700 transition">
                  Elegir archivos
                </span>
              </label>

              {error && (
                <p className="text-red-600 text-center text-sm bg-red-100 p-2 rounded-xl">{error}</p>
              )}

              {files.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm">
                  <h3 className="font-semibold text-blue-700 mb-2 text-center">
                    Archivos seleccionados
                  </h3>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center gap-2 text-blue-900">
                        <FileText className="w-5 h-5 text-blue-700" /> {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button className="w-full py-3 rounded-2xl text-lg bg-blue-600 hover:bg-blue-700">
                Subir Documento
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
