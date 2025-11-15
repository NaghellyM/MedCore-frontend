import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { FormField } from "./FormField"

interface PasswordFieldProps {
    name: string
    label: string
    placeholder?: string
    control: any
    error?: any
    className?: string
}

export function PasswordField({
    name,
    label,
    placeholder = "••••••••",
    control,
    error,
    className = "",
}: PasswordFieldProps) {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(prev => !prev)

    return (
        <FormField
            name={name}
            label={label}
            control={control}
            error={error}
            className={className}
        >
            {(field) => (
                <div className="relative">
                    <input
                        {...field}
                        type={isVisible ? "text" : "password"}
                        placeholder={placeholder}
                        className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-pressed={isVisible}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-r-lg"
                    >
                        {isVisible ? (
                            <EyeOff size={20} aria-hidden="true" />
                        ) : (
                            <Eye size={20} aria-hidden="true" />
                        )}
                    </button>
                </div>
            )}
        </FormField>
    )
}