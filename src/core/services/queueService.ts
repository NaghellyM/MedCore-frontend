import http from "../../infrastructure/http/http"
import { ApiUrls } from "../../environments/environments"


const queueUrl = `${ApiUrls.msClinical}/queue`

export const queueService = {

  // Obtener cola actual de un medico por su ID
  async getCurrentQueueByDoctorId(doctorId: string) {
    const response = await http.get(
      `${queueUrl}/doctor/${doctorId}/current`
    )
    return response.data
  },

  // Obtener posicion en la cola 
  async getQueuePosition(queueId: string) {
    const response = await http.get(
      `${queueUrl}/ticket/${queueId}/position`
    )
    return response.data
  },

  // Añadir paciente a la cola de un medico
  async addPatientToQueue(appointmentId: string) {
    const response = await http.post(
      `${queueUrl}/join`,
      { appointmentId }
    )
    return response.data
  },

  // Llamar al siguiente paciente en la cola de un medico
  async callNextPatient(doctorId: string) {
    const response = await http.post(
      `${queueUrl}/call-next`,
      { doctorId }
    )
    return response.data
  }, 

  // Marcar como atendido al paciente actual en la cola de un medico
  async markCurrentPatientAsAttended(appointmentId: string) {
    const response = await http.post(
      `${queueUrl}/ticket/${appointmentId}/complete`,
      {}
    )
    return response.data
  },

}