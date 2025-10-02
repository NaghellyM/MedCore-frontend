import React from 'react';
import { Controller } from 'react-hook-form';

interface InputProps {
    name: string;
    label: string;
    control: any;
    type?: string;
    error?: any;
}

const Input: React.FC<InputProps> = ({ name, label, control, type = "text", error }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700" htmlFor={name}>{label}</label>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <input 
                    {...field} 
                    id={name} 
                    type={type} 
                    className="mt-1 p-2 w-full border rounded-md"
                    value={field.value || ""} 
                />
            )}
        />
        {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
);

export default Input;
