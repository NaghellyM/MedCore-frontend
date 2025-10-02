
import { ApiUrls } from "../../environments/environments";
import { apiPost } from "../../infrastructure/http/apiPost";

export interface LoginResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const url = `${ApiUrls.msSecurity}/auth/sign-in`;
  const data = { email, current_password: password };
  return apiPost<LoginResponse>(url, data);
}