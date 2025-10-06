import { Controller } from "react-hook-form"

interface InputFieldProps {
    name: string
    label: string
    type: string
    control: any
    error: any
}

export function InputField({ name, label, type, control, error }: InputFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium">{label}</label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        {...field}
                        type={type}
                        className="w-full border rounded px-3 py-2"
                        value={field.value || ""}
                    />
                )}
            />
            {error && (
                <p className="text-red-500 text-xs">{error.message}</p>
            )}
        </div>
    )
}
