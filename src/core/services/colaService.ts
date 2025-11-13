import http from "../../infrastructure/http/http"

export const ColaService = {
  async getDoctorQueue(doctorId: string): Promise<any> {
  try {
    const response = await http.get(`http://localhost:4001/api/v1/queue/doctor/${doctorId}/current`)
    return response.data
  } catch (e) {
    console.error(`error al cargar la cola`, e)
  }
},

}
