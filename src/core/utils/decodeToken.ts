import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode} from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface TokenPayload {
  sub: string;       
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export function decodeToken(token: string): TokenPayload {
  return jwtDecode<TokenPayload>(token);
}