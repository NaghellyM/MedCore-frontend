// utils/scheduleUtils.ts
export function getAvailableSlots(appointments: any[], date: string) {
  // ⚙️ Descomponer fecha manualmente para evitar desfases por zona horaria
  const [year, month, day] = date.split("-").map(Number)

  // ✅ Crear las fechas localmente (sin ISO string)
  const startOfDay = new Date(year, month - 1, day, 7, 0, 0)
  const endOfDay = new Date(year, month - 1, day, 18, 0, 0)
  const lunchStart = new Date(year, month - 1, day, 12, 0, 0)
  const lunchEnd = new Date(year, month - 1, day, 13, 0, 0)
  const slotDuration = 20 * 60 * 1000

  // 🔄 Ordenar citas existentes
  const sortedAppointments = appointments
    .map((a) => ({
      start: new Date(a.startTime),
      end: new Date(a.endTime),
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  const available: { start: Date; end: Date }[] = []
  let current = new Date(startOfDay)

  while (current < endOfDay) {
    const slotEnd = new Date(current.getTime() + slotDuration)

    // ⏸ Saltar almuerzo
    if (
      (current >= lunchStart && current < lunchEnd) ||
      (slotEnd > lunchStart && slotEnd <= lunchEnd)
    ) {
      current = new Date(lunchEnd)
      continue
    }

    // 🚫 Verificar si el bloque se cruza con alguna cita existente
    const isOccupied = sortedAppointments.some(
      (a) =>
        (current >= a.start && current < a.end) ||
        (slotEnd > a.start && slotEnd <= a.end) ||
        (current <= a.start && slotEnd >= a.end)
    )

    if (!isOccupied && slotEnd <= endOfDay) {
      available.push({ start: new Date(current), end: slotEnd })
    }

    current = slotEnd
  }

  return available
}
