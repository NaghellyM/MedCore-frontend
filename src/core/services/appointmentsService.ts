import httpClinical from "../../infrastructure/http/httpClinical";

// URL base para citas
const appointmentsUrl = `/appointments`;

interface FilterParams {
  doctorId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  patientId?: string;
}

interface AppointmentResponse {
  appointments: any[];
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

// Filtrar citas disponibles (todos los parámetros son opcionales)
export const appointmentsService = {
  async filterAppointments(params: FilterParams): Promise<AppointmentResponse> {
    try {
      const query = new URLSearchParams();
      if (params.doctorId) query.append("doctorId", params.doctorId);
      if (params.date) query.append("date", params.date);
      if (params.startDate) query.append("startDate", params.startDate);
      if (params.endDate) query.append("endDate", params.endDate);
      if (params.startTime) query.append("startTime", params.startTime);
      if (params.endTime) query.append("endTime", params.endTime);
      if (params.patientId) query.append("patientId", params.patientId);

      const response = await httpClinical.get(
        `${appointmentsUrl}/filter?${query.toString()}`
      );

      return {
        appointments: response.data?.appointments || [],
        total: response.data?.total || 0,
        totalPages: response.data?.totalPages || 1,
        currentPage: response.data?.currentPage || 1,
      };
    } catch (error) {
      throw error;
    }
  },

  // Crear (agendar) una nueva cita
  async createAppointment(data: {
    patientId: string;
    doctorId: string;
    startTime: string;
  }) {
    try {
      const response = await httpClinical.post(
        `${appointmentsUrl}/create`,
        data
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancelar cita recibiendo solo el ID
  async cancelAppointment(appointmentId: string) {
    try {
      const response = await httpClinical.patch(
        `${appointmentsUrl}/${appointmentId}/cancel`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
