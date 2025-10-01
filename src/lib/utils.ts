import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode} from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export interface TokenPayload {
  sub: string;       // id de usuario
  email: string;
  role: string;      // rol que nos interesa
  exp: number;       // fecha de expiración
  iat: number;       // fecha de emisión
}

export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}