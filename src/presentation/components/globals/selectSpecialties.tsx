import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"

interface SelectSpecialtyProps {
  name: string
  control: any
  error: any
}

export function SelectSpecialty({ name, control, error }: SelectSpecialtyProps) {
  const [specialties, setSpecialties] = useState<{ id: number; name: string }[]>([])

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch("https://api.example.com/specialties")
        const data = await response.json()
        setSpecialties(data)
      } catch (err) {
        // Error handled silently - specialties will remain empty
      }
    }

    fetchSpecialties()
  }, [])

  return (
    <div>
      <label className="block text-sm font-medium">Specialty</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select {...field} className="w-full border rounded px-3 py-2">
            <option value="">Select a specialty...</option>
            {specialties.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {specialty.name}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  )
}
