import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "../types/tokenTypes";
import type { ITokenDecoder, ISafeTokenDecoder } from "./tokenDecoder";

export class JwtTokenDecoder
    implements ITokenDecoder<TokenPayload>, ISafeTokenDecoder<TokenPayload> {
    decode(token: string): TokenPayload {
        return jwtDecode<TokenPayload>(token);
    }
    safeDecode(token: string): TokenPayload | null {
        try {
            return this.decode(token);
        } catch {
            return null;
        }
    }
}