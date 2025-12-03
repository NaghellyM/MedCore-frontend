import { Controller } from "react-hook-form"
import { motion } from "framer-motion"
import type { ReactElement } from "react"

interface FormFieldProps {
    name: string
    label: string
    type?: string
    placeholder?: string
    control: any
    error?: any
    className?: string
    children?: (field: any) => ReactElement
}

export function FormField({
    name,
    label,
    type = "text",
    placeholder = "",
    control,
    error,
    className = "",
    children,
}: FormFieldProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="block text-sm font-medium text-foreground">
                {label}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) =>
                    children ? (
                        children(field)
                    ) : (
                        <input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            className="w-full p-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                        />
                    )
                }
            />

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive text-sm"
                >
                    {error.message}
                </motion.p>
            )}
        </div>
    )
}