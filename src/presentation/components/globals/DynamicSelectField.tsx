import { motion } from "framer-motion"
import { FormField } from "../ui/FormField"

interface DynamicSelectFieldProps {
    name: string
    label: string
    options: Array<{ id?: string; name: string; value?: string }>
    placeholder?: string
    control: any
    error?: any
    isVisible: boolean
}

export function DynamicSelectField({
    name,
    label,
    options,
    placeholder = "Selecciona una opción",
    control,
    error,
    isVisible,
}: DynamicSelectFieldProps) {
    if (!isVisible) return null

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
        >
            <FormField
                name={name}
                label={label}
                control={control}
                error={error}
            >
                {(field) => (
                    <select
                        {...field}
                        className="w-full p-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                    >
                        <option value="" className="bg-card text-muted-foreground">{placeholder}</option>
                        {options.map((option) => (
                            <option
                                key={option.id || option.name}
                                value={option.value || option.name}
                                className="bg-card text-foreground"
                            >
                                {option.name}
                            </option>
                        ))}
                    </select>
                )}
            </FormField>
        </motion.div>
    )
}