import httpClinical from "../../infrastructure/http/httpClinical"

const queueUrl = `/queue`

export const queueService = {

  // Obtener cola actual de un medico por su ID
  async getCurrentQueueByDoctorId(doctorId: string) {
    const response = await httpClinical.get(
      `${queueUrl}/doctor/${doctorId}/current`
    )
    return response.data
  },

  // Obtener posicion en la cola 
  async getQueuePosition(queueId: string) {
    const response = await httpClinical.get(
      `${queueUrl}/ticket/${queueId}/position`
    )
    return response.data
  },

  // Añadir paciente a la cola de un medico
  async addPatientToQueue(appointmentId: string) {
    const response = await httpClinical.post(
      `${queueUrl}/join`,
      { appointmentId }
    )
    return response.data
  },

  // Llamar al siguiente paciente en la cola de un medico
  async callNextPatient(doctorId: string) {
    if (!doctorId || doctorId.trim() === "") {
      throw new Error("doctorId es requerido para llamar al siguiente paciente");
    }
    const response = await httpClinical.post(
      `${queueUrl}/call-next`,
      { doctorId }
    )
    return response.data
  },

  // Marcar como atendido al paciente actual en la cola de un medico
  async markCurrentPatientAsAttended(appointmentId: string) {
    if (!appointmentId || appointmentId.trim() === "") {
      throw new Error("appointmentId es requerido para completar la atención");
    }
    const response = await httpClinical.put(
      `${queueUrl}/ticket/${appointmentId}/complete`,
      {}
    )
    return response.data
  },

}