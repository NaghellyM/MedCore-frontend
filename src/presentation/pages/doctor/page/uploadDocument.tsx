import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Upload, FileText, FolderUp } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { DashboardLayout } from "../../../layouts/dashboardLayout";
import DoctorSidebar from "../components/doctorSideBar";

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

    MySwal.fire({
      icon: "warning",
      title: "Función no disponible",
      text: "Esta función está siendo refactorizada. Use la carga de documentos desde el formulario de historia médica.",
    });
    return;
  };

  return (
    <DashboardLayout sidebar={<DoctorSidebar />} showSearch={false}>
      <div className="p-6 space-y-6">
        {/* Título */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
            <FolderUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subir Documentos</h1>
            <p className="text-muted-foreground">Carga resultados y documentos médicos del paciente</p>
          </div>
        </div>

        {/* Card principal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="max-w-2xl mx-auto shadow-lg border border-border bg-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <label
                  htmlFor="fileInput"
                  className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center
                  bg-muted/50 hover:bg-muted transition cursor-pointer"
                >
                  <Upload className="w-14 h-14 text-primary mb-3" />
                  <p className="text-foreground text-sm font-medium">
                    Selecciona un archivo (PDF, JPG, PNG)
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Tamaño máximo: 10MB
                  </p>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="fileInput"
                  />

                  <span className="px-4 py-2 mt-4 bg-primary text-primary-foreground rounded-xl cursor-pointer hover:bg-primary/90 transition">
                    Elegir archivos
                  </span>
                </label>

                {error && (
                  <p className="text-destructive text-center text-sm bg-destructive/10 p-3 rounded-xl">{error}</p>
                )}

                {files.length > 0 && (
                  <div className="bg-muted p-4 rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-3 text-center">
                      Archivos seleccionados
                    </h3>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center gap-2 text-foreground">
                          <FileText className="w-5 h-5 text-primary" /> {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full py-3 rounded-xl text-lg"
                  disabled={files.length === 0}
                >
                  Subir Documento
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
