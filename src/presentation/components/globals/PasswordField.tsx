import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { FormField } from "../ui/FormField"

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
                        className="w-full p-2 pr-10 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                    />
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                        aria-pressed={isVisible}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-r-lg transition-colors duration-300"
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