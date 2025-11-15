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
            <label className="block text-sm font-medium text-gray-700">
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
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    )
                }
            />

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                >
                    {error.message}
                </motion.p>
            )}
        </div>
    )
}