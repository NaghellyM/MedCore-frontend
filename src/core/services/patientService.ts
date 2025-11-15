import http from "../../infrastructure/http/httpSecurity"
import httpPatient from "../../infrastructure/http/httpPatient"
import type { RegisterUserDto } from "../models/user"
import type { Patient, GetPatientResponse } from "../models/patient"
import { ApiUrls } from "../../environments/environments"

export async function registerUser(user: RegisterUserDto) {
  const response = await http.post(`${ApiUrls.msSecurity}/auth/sign-up`, user)
  return response.data
}

export async function getPatientById(patientId: string): Promise<Patient> {
  try {
    const response = await httpPatient.get<GetPatientResponse>(`/patients/${patientId}`)
    return response.data
  } catch (error) {
    throw error
  }
}
