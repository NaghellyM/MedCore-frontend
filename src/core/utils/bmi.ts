/**
 * Calcula BMI a partir de altura en cm y peso en kg.
 * Devuelve null si falta algún dato o si no es numérico.
 */
export function calcBMI(heightCm?: string, weightKg?: string): number | null {
    const h = Number(heightCm)
    const w = Number(weightKg)
    if (!h || !w) return null
    const meters = h / 100
    if (!meters || Number.isNaN(meters)) return null
    const bmi = w / (meters * meters)
    return Number.isFinite(bmi) ? Number(bmi.toFixed(2)) : null
}
