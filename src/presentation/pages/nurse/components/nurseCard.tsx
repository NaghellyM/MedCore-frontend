import { Pencil, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

interface Nurse {
  id: string
  fullname: string
  email?: string
  identificacion: string
  phone?: string
  license_number?: string
  role?: string // coincide con tu API
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "UNKNOWN"
  avatar?: string
}

interface NurseCardProps {
  nurse: Nurse
  onDelete: (id: string) => Promise<void> | void
  onEdit: (updatedNurse: Nurse) => Promise<void> | void
}

export default function NurseCard({ nurse, onDelete, onEdit }: NurseCardProps) {
  const statusConfig = {
    ACTIVE: { text: "Activo", color: "bg-green-200 text-green-800" },
    INACTIVE: { text: "Inactivo", color: "bg-red-200 text-red-800" },
    PENDING: { text: "Pendiente", color: "bg-yellow-200 text-yellow-800" },
    UNKNOWN: { text: "Desconocido", color: "bg-gray-200 text-gray-700" },
  } as const

  const normalizedStatus = nurse.status?.toUpperCase()
  const isValidStatus = (status: string): status is keyof typeof statusConfig => {
    return status in statusConfig
  }

  const { text, color } = isValidStatus(normalizedStatus) 
    ? statusConfig[normalizedStatus] 
    : statusConfig.UNKNOWN

  const gender = Math.random() > 0.5 ? "girl" : "boy"
  const avatarUrl =
    nurse.avatar || `https://avatar.iran.liara.run/public/${gender}?username=${encodeURIComponent(nurse.fullname)}`

  // 🔹 Editar enfermera directamente en el card
  const handleEdit = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Editar Enfermera",
      html: `
        <input id="fullname" class="swal2-input" placeholder="Nombre completo" value="${nurse.fullname || ''}">
        <input id="email" class="swal2-input" placeholder="Correo electrónico" value="${nurse.email || ''}">
        <input id="identificacion" class="swal2-input" placeholder="Identificación" value="${nurse.identificacion || ''}">
        <input id="phone" class="swal2-input" placeholder="Teléfono" value="${nurse.phone || ''}">
        <input id="license" class="swal2-input" placeholder="Licencia profesional" value="${nurse.license_number || ''}">
        <select id="status" class="swal2-select">
          <option value="ACTIVE" ${nurse.status === "ACTIVE" ? "selected" : ""}>Activo</option>
          <option value="INACTIVE" ${nurse.status === "INACTIVE" ? "selected" : ""}>Inactivo</option>
          <option value="PENDING" ${nurse.status === "PENDING" ? "selected" : ""}>Pendiente</option>
        </select>
      `,
      focusConfirm: false,
      confirmButtonText: "Guardar cambios",
      showCancelButton: true,
      preConfirm: () => {
        const fullname = (document.getElementById("fullname") as HTMLInputElement).value.trim()
        const email = (document.getElementById("email") as HTMLInputElement).value.trim()
        const identificacion = (document.getElementById("identificacion") as HTMLInputElement).value.trim()
        const phone = (document.getElementById("phone") as HTMLInputElement).value.trim()
        const license_number = (document.getElementById("license") as HTMLInputElement).value.trim()
        const status = (document.getElementById("status") as HTMLSelectElement).value

        if (!fullname || !identificacion) {
          MySwal.showValidationMessage("Nombre e identificación son obligatorios")
          return false
        }

        return { fullname, email, identificacion, phone, license_number, status }
      },
    })

    if (formValues) {
      // 🔹 No enviar la identificación al backend
      const { identificacion, ...dataToSend } = formValues

      await onEdit({ ...nurse, ...dataToSend })
      MySwal.fire({
        icon: "success",
        title: "Actualizado",
        text: "La enfermera fue actualizada correctamente.",
        timer: 1500,
        showConfirmButton: false,
      })
    }
  }

  // 🔹 Eliminar enfermera
  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará permanentemente a la enfermera.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      await onDelete(nurse.id)
      MySwal.fire("Eliminado", "La enfermera fue eliminada correctamente.", "success")
    }
  }

  return (
    <div className="relative border rounded-xl p-5 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 bg-gradient-to-br from-white via-pink-50 to-pink-100 flex flex-col items-center text-center">
      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${color}`}>
        {text}
      </span>

      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-pink-200 shadow-inner bg-white flex items-center justify-center">
        <img src={avatarUrl} alt={nurse.fullname} className="w-full h-full object-cover" />
      </div>

      <h3 className="font-bold text-xl text-gray-800 mb-1">{nurse.fullname}</h3>
      <p className="text-sm text-gray-500 mb-1">ID: {nurse.identificacion}</p>
      {nurse.email && <p className="text-sm text-gray-500 mb-1">Email: {nurse.email}</p>}
      {nurse.phone && <p className="text-sm text-gray-500 mb-1">Tel: {nurse.phone}</p>}
      {nurse.license_number && <p className="text-sm text-gray-500 mb-1">Licencia: {nurse.license_number}</p>}
      {nurse.role && (  
        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-200 to-pink-300 text-pink-800 shadow-sm uppercase mb-3">
          {nurse.role}
        </span>
      )}

      <div className="flex space-x-3 mt-auto">
        <button
          onClick={handleEdit}
          className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
        >
          <Pencil size={16} /> Editar
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          <Trash2 size={16} /> Eliminar
        </button>
      </div>
    </div>
  )
}
