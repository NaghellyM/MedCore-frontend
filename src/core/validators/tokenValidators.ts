import type { TokenPayload } from "../types/tokenTypes";

export const isExpired = (p?: Pick<TokenPayload, "exp"> | null) =>
!p || p.exp * 1000 <= Date.now();


export const hasRole = (p: Pick<TokenPayload, "role">, roles: string[]) =>
roles.includes(p.role);