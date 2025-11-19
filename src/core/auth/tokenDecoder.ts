import type { TokenPayload } from "../types/auth";

export interface ITokenDecoder<T = TokenPayload> {
decode(token: string): T;
}

export interface ISafeTokenDecoder<T = TokenPayload> {
safeDecode(token: string): T | null;
}