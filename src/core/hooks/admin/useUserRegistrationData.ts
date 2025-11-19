import { useState, useEffect } from 'react'
import { doctorsService } from '../../../core/services/doctorsService'

interface UseUserRegistrationDataReturn {
    specialties: Array<{ id: string; name: string }>
    departments: string[]
    loading: boolean
    error: string | null
}

export function useUserRegistrationData(): UseUserRegistrationDataReturn {
    const [specialties, setSpecialties] = useState<Array<{ id: string; name: string }>>([])
    const [departments, setDepartments] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Cargar especialidades
                const specialtiesResponse = await doctorsService.getSpecialties()
                if (Array.isArray(specialtiesResponse)) {
                    const mappedSpecialties = specialtiesResponse.map((esp: any) => ({
                        id: esp.id,
                        name: esp.nombre,
                    }))
                    setSpecialties(mappedSpecialties)
                }

                // Cargar departamentos (simulated - replace with actual service call)
                const departmentsList = ["Urgencias", "Pediatría", "UCI", "Oncología", "Farmacia"]
                setDepartments(departmentsList)

            } catch (err) {
                setError("Error al cargar los datos necesarios para el registro")
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    return {
        specialties,
        departments,
        loading,
        error,
    }
}