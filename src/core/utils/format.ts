export const fmt = (v?: string | number | null): string => {
    if (v == null) return "—";                 
    if (typeof v === "string") return v || "—"; 
    return String(v);                           
}

export const fmtDateTime = (s?: string | null): string =>
    s ? new Date(s).toLocaleString() : "—"
