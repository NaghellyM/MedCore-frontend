import { Controller } from "react-hook-form"

interface SelectRoleProps {
    name: string
    control: any
    error: any
}

export function SelectRole({ name, control, error }: SelectRoleProps) {
    return (
        <div>
            <label className="block text-sm font-medium">Rol</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <select {...field} className="w-full border rounded px-3 py-2">
                        <option value="ADMINISTRADOR">Administrador</option>
                        <option value="PACIENTE">Paciente</option>
                        <option value="MEDICO">Médico</option>
                        <option value="ENFERMERA">Enfermera</option>
                    </select>
                )}
            />
            {error && (
                <p className="text-red-500 text-xs">{error.message}</p>
            )}
        </div>
    )
}
