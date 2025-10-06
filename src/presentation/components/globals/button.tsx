import React from 'react';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    type?: "submit" | "button";
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type = "button" }) => (
    <button
        type={type}
        onClick={onClick}
        className="w-full bg-blue-500 text-white py-2 rounded-md"
    >
        {label}
    </button>
);

export default Button;
