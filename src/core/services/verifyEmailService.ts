import { ApiUrls } from "../../environments/environments";
import { apiPost } from "../../infrastructure/http/apiPost";

export interface LoginResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export async function verifyEmail(email: string, code: string): Promise<LoginResponse> {
  const url = `${ApiUrls.msSecurity}/auth/verify-email`;
  const data = { email, verificationCode: code };
  return apiPost<LoginResponse>(url, data);
}
