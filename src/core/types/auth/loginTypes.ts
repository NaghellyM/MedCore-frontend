export interface IFormInput {
    nombre?: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    accessToken?: string;
    refreshToken?: string;
}