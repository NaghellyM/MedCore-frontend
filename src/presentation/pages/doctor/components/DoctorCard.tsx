import { Pencil, Trash2 } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { doctorsService } from "../../../../core/services/doctorsService"

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
    ACTIVE: { text: "Activo", color: "bg-green-100 text-green-700 border-green-300" },
    INACTIVE: { text: "Inactivo", color: "bg-red-100 text-red-700 border-red-300" },
    PENDING: { text: "Pendiente", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  }

  const { text, color } = statusConfig[normalizedStatus] || statusConfig.INACTIVE

  const gender = Math.random() > 0.5 ? "boy" : "girl"
  const avatarUrl =
    doctor.avatar ||
    `https://avatar.iran.liara.run/public/${gender}?username=${encodeURIComponent(doctor.name)}`

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

        MySwal.fire("Actualizado", "Los datos del doctor fueron actualizados correctamente.", "success")
        onUpdate()
      }
    } catch (error) {
      console.error("Error al editar doctor:", error)
      MySwal.fire("Error", "No se pudo cargar o actualizar el doctor.", "error")
    }
  }

  return (
    <div className="relative border rounded-xl p-5 shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center text-center">
      <div
        className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${color} shadow-sm backdrop-blur-sm`}
      >
        {text}
      </div>

      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-blue-200 shadow-inner bg-white flex items-center justify-center">
        <img src={avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
      </div>

      <h3 className="font-bold text-xl text-gray-800 mb-1">{doctor.name}</h3>
      <p className="text-sm text-gray-500 mb-1">ID: {doctor.identification}</p>

      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-200 via-pink-200 to-pink-300 text-purple-800 shadow-sm mb-4">
        {doctor.specialty || "Sin especialidad"}
      </span>

      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleEdit}
          className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 shadow-md hover:shadow-lg transition"
          title="Editar doctor"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md hover:shadow-lg transition"
          title="Eliminar doctor"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
