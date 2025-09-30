import { ArrowUpFromLine } from "lucide-react";
import React from "react";

export function AdminRegisterCSV() {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleIconClick = () => {
        fileInputRef.current?.click();  
    };
    return (
        <div className="p-8 bg-white max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Carga de Archivo CSV</h1>
            <p className="text-gray-600 mb-6">Sube tu archivo CSV para importar usuarios. Asegúrate de que el archivo esté en el formato correcto.</p>
            <div className="flex items-center justify-center border-dashed border-2 border-gray-300 p-8 rounded-lg">
                <div 
                    onClick={handleIconClick}
                    className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600"
                >
                    <ArrowUpFromLine className="w-6 h-6 mr-2" />
                    <span className="text-lg">Arrastra tu archivo CSV aquí o haz clic para seleccionar</span>
                </div>
                <input 
                    type="file" 
                    accept=".csv" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                />
            </div>
            <div className="flex justify-end mt-4">
                <button className="bg-cuidarte-accent text-white px-6 py-2 rounded-md hover:bg-cuidarte-accent-dark">
                    Subir y Validar Usuarios
                </button>
            </div>
        </div>
    );
}
