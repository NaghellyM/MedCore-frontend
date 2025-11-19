import { ApiUrls } from "../../environments/environments";
import {apiPost} from "../../infrastructure/http/apiPost";
import type { LoginResponse } from "../services/verifyEmailService";

export function handleApiError(error: any): string {
    return error?.response?.data?.message || error?.message || "Error desconocido";
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {
        const url = `${ApiUrls.msSecurity}/auth/sign-in`;
        const data = { email, current_password: password };
        return await apiPost<LoginResponse>(url, data);
    } catch (err) {
        throw new Error(handleApiError(err));
    }
}

export async function verifyEmail(email: string, code: string): Promise<LoginResponse> {
    try {
        const url = `${ApiUrls.msSecurity}/auth/verify-email`;
        const data = { email, verificationCode: code };
        return await apiPost<LoginResponse>(url, data);
    } catch (err) {
        throw new Error(handleApiError(err));
    }
}
