import type { Control } from "react-hook-form"
import { InputField } from "../../../components/globals/inputField"
import { SelectRole } from "../../../components/globals/selectRole"
import type { RegisterUserDto } from "../../../../core/models/user"
import { SubmitButton } from "../../../components/globals/submitButton"


interface UserFormProps {
    control: Control<RegisterUserDto>
    onSubmit: (data: any) => void
    errors: any
    loading: boolean
}

export function UserForm({ control, onSubmit, errors, loading }: UserFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <InputField 
                name="email" 
                label="Correo *" 
                type="email" 
                control={control} 
                error={errors.email}
            />
            <InputField 
                name="fullname" 
                label="Nombre Completo *" 
                type="text" 
                control={control} 
                error={errors.fullname}
            />
            <InputField 
                name="current_password" 
                label="Contraseña *" 
                type="password" 
                control={control} 
                error={errors.current_password}
            />
            <SelectRole 
                name="role" 
                control={control} 
                error={errors.role} 
            />
            <SubmitButton loading={loading} />
        </form>
    )
}
