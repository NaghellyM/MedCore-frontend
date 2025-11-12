import { useRef, useState } from "react"
import Papa from "papaparse"
import * as Yup from "yup"
import Swal from "sweetalert2"
import { UploadCloud, Download, ArrowLeftCircle, CheckCircle, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { uploadUsersCsv } from "../../../../core/services/userImportService"

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
    Papa.parse(file, {
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
  const [loading, setLoading] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)
  const navigate = useNavigate()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
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
      setLoading(false)
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
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      {/* Botón Volver */}
      <div className="w-full max-w-4xl mb-6 flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md transition"
        >
          <ArrowLeftCircle className="w-5 h-5" />
          Volver al AdminPage
        </button>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8 transition-all duration-300">
        {/* Encabezado */}
        <div className="text-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910769.png"
            alt="Usuarios ilustración"
            className="mx-auto w-24 h-24 mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-800">Cargue Masivo de Usuarios</h2>
          <p className="text-gray-500 mt-1">Sube un archivo CSV con los usuarios a registrar.</p>
        </div>

        {/* Botón descargar plantilla */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            <Download className="w-4 h-4" />
            Descargar plantilla CSV
          </button>
        </div>

        {/* Área de carga */}
        <div className="border-2 border-dashed border-blue-300 rounded-2xl p-8 bg-blue-50 hover:bg-blue-100 transition cursor-pointer text-center flex flex-col items-center">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="flex flex-col items-center space-y-2 cursor-pointer">
            <UploadCloud className="text-blue-500 w-10 h-10" />
            <span className="text-blue-600 font-medium">Haz clic o arrastra tu archivo CSV aquí</span>
            <span className="text-sm text-gray-500">Solo archivos .csv</span>
          </label>
        </div>

        {/* --- Resultado de la importación --- */}
        {importResult && (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Resumen de importación</h3>

            {/* Usuarios importados */}
            {importResult.usuariosImportados?.length > 0 && (
              <div>
                <h4 className="text-lg font-medium text-green-600 mb-2">✅ Usuarios importados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importResult.usuariosImportados.map((user: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm"
                    >
                      <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                      <div>
                        <p className="font-semibold">{user.fullname}</p>
                        <p className="text-sm text-green-700">
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
                <h4 className="text-lg font-medium text-red-600 mb-2">⚠️ Usuarios no importados</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importResult.errors.map((err: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm"
                    >
                      <XCircle className="text-red-500 w-6 h-6 mr-2" />
                      <p className="text-sm text-red-700">{err}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}