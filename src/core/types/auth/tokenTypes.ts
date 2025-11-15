export interface TokenPayload {
    sub: string;
    fullname: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
}