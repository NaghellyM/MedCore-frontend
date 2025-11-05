import type { EncounterPayload } from "../types/medicalHistoryTypes"

const BASE = "/api/encounters"

export async function createEncounter(payload: EncounterPayload) {
    const res = await fetch(BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
    })
    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(text || `Error ${res.status}`)
    }
    return res.json()
}
