import { Pencil, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { doctorsService } from "../../../../core/services/doctorsService"
import { toast } from "sonner"

const MySwal = withReactContent(Swal)

interface DoctorCardProps {
  doctor: {
    id: string
    name: string
    identification: string
    specialty: string
    active: boolean
    avatar?: string
    status?: string
    email?: string
    phone?: string
  }
  onDelete: (id: string) => void
  onUpdate: () => void
}

export default function DoctorCard({ doctor, onDelete, onUpdate }: DoctorCardProps) {
  const normalizedStatus = doctor.status
    ? doctor.status.toUpperCase()
    : doctor.active
    ? "ACTIVE"
    : "INACTIVE"

  const statusConfig = {
    ACTIVE: { text: "Activo", color: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700" },
    INACTIVE: { text: "Inactivo", color: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700" },
    PENDING: { text: "Pendiente", color: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700" },
  } as const

  const { text, color } = statusConfig[normalizedStatus as keyof typeof statusConfig] || statusConfig.INACTIVE

  // Usar UI Avatars como servicio de avatares (más confiable)
  const avatarUrl =
    doctor.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=3b82f6&color=fff&size=128&bold=true`

  // 🔹 Eliminar doctor
  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: "¿Eliminar doctor?",
      text: `Se eliminará al doctor ${doctor.name}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      try {
        await doctorsService.deleteDoctor(doctor.id)
        MySwal.fire("Eliminado", "El doctor ha sido eliminado correctamente.", "success")
        onDelete(doctor.id)
      } catch (error) {
        MySwal.fire("Error", "No se pudo eliminar el doctor.", "error")
      }
    }
  }

  // 🔹 Editar doctor
  const handleEdit = async () => {
    try {
      const doctorData = await doctorsService.getDoctorById(doctor.id)

      if (!doctorData) {
        MySwal.fire("Error", "No se pudieron obtener los datos del doctor.", "error")
        return
      }

      const { value: formValues } = await MySwal.fire({
        title: "Editar doctor",
        html: `
          <input id="swal-name" class="swal2-input" placeholder="Nombre completo" value="${doctorData.fullname || ""}">
          <input id="swal-email" class="swal2-input" placeholder="Correo electrónico" value="${doctorData.email || ""}">
          <input id="swal-id" class="swal2-input" placeholder="Identificación" value="${doctorData.identificacion || ""}">
          <input id="swal-phone" class="swal2-input" placeholder="Teléfono" value="${doctorData.phone || ""}">
          <input id="swal-license" class="swal2-input" placeholder="Licencia profesional" value="${doctorData.license_number || ""}">
          <input id="swal-date" type="date" class="swal2-input" value="${doctorData.date_of_birth ? doctorData.date_of_birth.split("T")[0] : ""}">
          <select id="swal-status" class="swal2-select">
            <option value="ACTIVE" ${doctorData.status === "ACTIVE" ? "selected" : ""}>Activo</option>
            <option value="PENDING" ${doctorData.status === "PENDING" ? "selected" : ""}>Pendiente</option>
            <option value="INACTIVE" ${doctorData.status === "INACTIVE" ? "selected" : ""}>Inactivo</option>
          </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const fullname = (document.getElementById("swal-name") as HTMLInputElement)?.value
          const email = (document.getElementById("swal-email") as HTMLInputElement)?.value
          const identificacion = (document.getElementById("swal-id") as HTMLInputElement)?.value
          const phone = (document.getElementById("swal-phone") as HTMLInputElement)?.value
          const license_number = (document.getElementById("swal-license") as HTMLInputElement)?.value
          const date_of_birth = (document.getElementById("swal-date") as HTMLInputElement)?.value
          const status = (document.getElementById("swal-status") as HTMLSelectElement)?.value

          if (!fullname || !email) {
            Swal.showValidationMessage("El nombre y el correo son obligatorios")
            return
          }

          return { fullname, email, identificacion, phone, license_number, date_of_birth, status }
        },
      })

      if (formValues) {
        // 🔹 Llamada actualizada al servicio
        await doctorsService.updateDoctor(doctor.id, formValues)

        // Use toast for successful CRUD operations (non-blocking feedback)
        toast.success("Doctor actualizado", {
          description: "Los datos del doctor fueron actualizados correctamente",
          duration: 4000
        })
        onUpdate()
      }
    } catch (error) {
      console.error("Error al editar doctor:", error)
      // Use toast for CRUD errors (quick feedback)
      toast.error("Error al actualizar", {
        description: "No se pudo cargar o actualizar el doctor",
        duration: 6000
      })
    }
  }

  return (
    <div className="relative border border-border rounded-xl p-5 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 bg-card flex flex-col items-center text-center">
      <div
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${color} shadow-sm backdrop-blur-sm`}
      >
        {text}
      </div>

      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-blue-200 dark:border-blue-800 shadow-inner bg-background flex items-center justify-center">
        <img src={avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
      </div>

      <h3 className="font-bold text-xl text-foreground mb-1">{doctor.name}</h3>
      <p className="text-sm text-muted-foreground mb-1">ID: {doctor.identification}</p>

      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-200 via-pink-200 to-pink-300 dark:from-purple-800 dark:via-pink-800 dark:to-pink-700 text-purple-800 dark:text-purple-200 shadow-sm mb-4">
        {doctor.specialty || "Sin especialidad"}
      </span>

      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleEdit}
          className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-xl hover:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-lg transition"
          title="Editar doctor"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500 dark:bg-red-600 text-white rounded-xl hover:bg-red-600 dark:hover:bg-red-700 shadow-md hover:shadow-lg transition"
          title="Eliminar doctor"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
