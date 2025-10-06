import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jwtDecode} from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface TokenPayload {
  sub: string;     
  fullname: string;  
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export function decodeToken(token: string): TokenPayload {
  const decoded = jwtDecode<TokenPayload>(token);
  console.log("Decoded token:", decoded);
  return decoded;
}