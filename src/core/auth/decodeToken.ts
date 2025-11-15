// core/auth/decodeToken.ts
import { JwtTokenDecoder } from "./jwtTokenDecoder";
import type { TokenPayload } from "../types/auth";

const decoder = new JwtTokenDecoder();

export function decodeToken(token: string): TokenPayload {
    return decoder.decode(token);
}

export function safeDecodeToken(token: string): TokenPayload | null {
    return decoder.safeDecode(token);
}
