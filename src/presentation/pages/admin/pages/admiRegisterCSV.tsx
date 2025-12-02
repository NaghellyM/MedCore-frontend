import { useRef, useState } from "react"
import Papa from "papaparse"
import * as Yup from "yup"
import Swal from "sweetalert2"
import { UploadCloud, Download, ArrowLeftCircle, CheckCircle, XCircle, ClipboardPlus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { uploadUsersCsv } from "../../../../core/services/userImportService"
import UserHeader from "../../../components/globals/header"

// --- Interfaz para las filas del CSV ---
interface CsvRow {
  email?: string
  fullname?: string
  id?: string
  role?: string
  current_password?: string
  status?: string
  date_of_birth?: string
  specialization?: string
  department?: string
  license_number?: string
  phone?: string
  [key: string]: any // Permite columnas adicionales
}

// --- Esquema de validación ---
const userCsvSchema = Yup.object().shape({
  email: Yup.string().email("Correo inválido").required("El email es obligatorio"),
  fullname: Yup.string().required("El nombre completo es obligatorio"),
  id: Yup.string().required("El ID es obligatorio"),
  role: Yup.string()
    .oneOf(["PACIENTE", "MEDICO", "ENFERMERA"], "Rol no válido")
    .required("El rol es obligatorio"),
  current_password: Yup.string().required("La contraseña es obligatoria"),
  date_of_birth: Yup.date().required("La fecha de nacimiento es obligatoria"),
})

// --- Función para parsear y validar el CSV ---
async function parseAndValidateCsv(file: File) {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const validUsers: any[] = []
        const errors: any[] = []

        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i]
          const normalizedRow = {
            ...row,
            email: row.email?.trim(),
            fullname: row.fullname?.trim(),
            id: row.id?.trim(),
            role: row.role?.trim()?.toUpperCase(),
            current_password: row.current_password?.trim(),
            status: row.status?.trim()?.toUpperCase(),
            date_of_birth: row.date_of_birth?.trim(),
          }

          try {
            const validUser = await userCsvSchema.validate(normalizedRow, { abortEarly: false })
            validUsers.push(validUser)
          } catch (validationError: any) {
            errors.push({
              row: i + 1,
              errors: validationError.errors,
              data: row,
            })
          }
        }

        if (errors.length > 0) reject({ errors })
        else resolve({ data: validUsers })
      },
      error: (err) => reject({ message: "Error al leer el CSV", error: err }),
    })
  })
}

export function AdminRegisterCSV() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importResult, setImportResult] = useState<any>(null)
  const navigate = useNavigate()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    Swal.fire({
      title: "Validando archivo...",
      text: "Por favor espera un momento mientras se revisa el CSV.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    })

    try {
      const result: any = await parseAndValidateCsv(file)
      Swal.close()

      const confirmed = await Swal.fire({
        icon: "success",
        title: "Archivo válido",
        html: `<p class="text-gray-600">Se validaron correctamente <b>${result.data.length}</b> usuarios.</p>
              <p class="mt-2 text-sm text-gray-500">¿Deseas enviarlo al servidor?</p>`,
        showCancelButton: true,
        confirmButtonText: "Sí, enviar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#6b7280",
        background: "#f9fafb",
      })

      if (confirmed.isConfirmed) {
        Swal.fire({
          title: "Enviando datos...",
          text: "Subiendo archivo al servidor.",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        })

        try {
          const backendResponse = await uploadUsersCsv(file)
          setImportResult(backendResponse) // <-- Guardamos la respuesta del backend
          Swal.close()
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error al enviar",
            text: "No se pudo enviar el archivo al backend.",
            confirmButtonColor: "#dc2626",
          })
        }
      }
    } catch (error: any) {
      Swal.close()
      const errorList =
        error.errors
          ?.map(
            (e: any) =>
              `<div class="text-left mb-2"><b>Fila ${e.row}:</b> <ul class="list-disc ml-6 text-sm text-gray-600">${e.errors
                .map((err: string) => `<li>${err}</li>`)
                .join("")}</ul></div>`
          )
          .join("") || "Error desconocido."

      Swal.fire({
        icon: "error",
        title: "Errores en el archivo",
        html: `<div class="max-h-60 overflow-y-auto text-gray-700">${errorList}</div>`,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#dc2626",
        background: "#fef2f2",
      })
    } finally {
      // Cleanup if needed
    }
  }

  const handleDownloadTemplate = () => {
    const headers = [
      "email",
      "fullname",
      "id",
      "role",
      "current_password",
      "status",
      "specialization",
      "department",
      "license_number",
      "phone",
      "date_of_birth",
    ]
    const csvContent = [headers.join(",")].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "plantilla_usuarios.csv"
    link.click()
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header con ThemeToggle */}
      <UserHeader showSearch={false} showThemeToggle={true} />

      <div className="pt-[100px] p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-card rounded-3xl shadow-xl p-8 transition-all duration-300 border border-border">
          {/* Botón Volver - dentro de la tarjeta */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              <ArrowLeftCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Regresar</span>
            </button>
          </div>

          {/* Encabezado */}
          <div className="text-center mb-6">
            <div className="mx-auto w-24 h-24 mb-3 flex items-center justify-center">
              <ClipboardPlus className="w-20 h-20 text-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Cargue Masivo de Usuarios</h2>
            <p className="text-muted-foreground mt-1">Sube un archivo CSV con los usuarios a registrar.</p>
          </div>

          {/* Botón descargar plantilla */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg shadow-md transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              Descargar plantilla CSV
            </button>
          </div>

          {/* Área de carga */}
          <div className="border-2 border-dashed border-primary/50 rounded-2xl p-8 bg-primary/5 hover:bg-primary/10 transition-colors duration-300 cursor-pointer text-center flex flex-col items-center">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="flex flex-col items-center space-y-2 cursor-pointer">
              <UploadCloud className="text-primary w-10 h-10" />
              <span className="text-primary font-medium">Haz clic o arrastra tu archivo CSV aquí</span>
              <span className="text-sm text-muted-foreground">Solo archivos .csv</span>
            </label>
          </div>

          {/* --- Resultado de la importación --- */}
          {importResult && (
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Resumen de importación</h3>

              {/* Usuarios importados */}
              {importResult.usuariosImportados?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-success mb-2">✅ Usuarios importados</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {importResult.usuariosImportados.map((user: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center p-4 bg-success-light border border-success/30 rounded-lg shadow-sm"
                      >
                        <CheckCircle className="text-success w-6 h-6 mr-2" />
                        <div>
                          <p className="font-semibold text-foreground">{user.fullname}</p>
                          <p className="text-sm text-success">
                            {user.role} - {user.identificacion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Errores */}
              {importResult.errors?.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-destructive mb-2">⚠️ Usuarios no importados</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {importResult.errors.map((err: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center p-4 bg-destructive-light border border-destructive/30 rounded-lg shadow-sm"
                      >
                        <XCircle className="text-destructive w-6 h-6 mr-2" />
                        <p className="text-sm text-destructive">{err}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}