// appointmentsService.ts
import http from "../../infrastructure/http/http"
import { ApiUrls } from "../../environments/environments"

interface FilterParams {
  doctorId?: string
  date?: string
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  patientId?: string
}

interface AppointmentResponse {
  appointments: any[]
  total?: number
  totalPages?: number
  currentPage?: number
}

export const appointmentsService = {
  // 🔍 Filtrar citas disponibles (todos los parámetros son opcionales)
  async filterAppointments(params: FilterParams): Promise<AppointmentResponse> {
    try {
      const query = new URLSearchParams()
      if (params.doctorId) query.append("doctorId", params.doctorId)
      if (params.date) query.append("date", params.date)
      if (params.startDate) query.append("startDate", params.startDate)
      if (params.endDate) query.append("endDate", params.endDate)
      if (params.startTime) query.append("startTime", params.startTime)
      if (params.endTime) query.append("endTime", params.endTime)
      if (params.patientId) query.append("patientId", params.patientId)

      const response = await http.get(
        `http://localhost:4001/api/v1/appointments/filter?${query.toString()}`
      )

      console.log("📅 Citas filtradas:", response.data)

      return {
        appointments: response.data?.appointments || [],
        total: response.data?.total || 0,
        totalPages: response.data?.totalPages || 1,
        currentPage: response.data?.currentPage || 1,
      }
    } catch (error) {
      console.error("❌ Error al filtrar citas:", error)
      throw error
    }
  },

  // 🩺 Crear (agendar) una nueva cita
  async createAppointment(data: {
    patientId: string
    doctorId: string
    startTime: string
  }) {
    console.log("digame que le mando:", data);

    try {
      const response = await http.post(
        "http://localhost:4001/api/v1/appointments/create",
        data
      )

      console.log("✅ Cita creada con éxito:", response.data)
      return response.data
    } catch (error) {
      console.error("❌ Error al crear cita:", error)
      throw error
    }
  },

  // ❌ Cancelar cita recibiendo solo el ID
  async cancelAppointment(appointmentId: string) {
    try {
      const response = await http.patch(
        `http://localhost:4001/api/v1/appointments/${appointmentId}/cancel`
      )
      console.log("✅ Cita cancelada con éxito:", response.data)
      return response.data
    } catch (error) {
      console.error("❌ Error al cancelar cita:", error)
      throw error
    }
  },

  // 📝 Actualizar el doctor de una cita
async updateDoctor(appointmentId: string, doctorId: string) {
  try {
    const response = await http.put(
      `http://localhost:4001/api/v1/appointments/${appointmentId}/update-doctor`,
      { doctorId }
    );

    console.log("✅ Doctor actualizado en la cita:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar doctor:", error);
    throw error;
  }
}

}
