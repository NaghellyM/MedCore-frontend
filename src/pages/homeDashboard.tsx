import React from "react";

const HomeDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center font-sans">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-secondary mb-2">
                    Bienvenido a MedCore
                </h1>
                <p className="text-lg text-gray-700">
                    Tu plataforma para gestión médica eficiente
                </p>
            </header>
            <main >
                <img src="./src/assets/images/Cuidarte_vive_al_100.png" alt="MedCore Logo" className="mx-auto mb-6 w-32 h-32" />
            </main>
            <footer className="mt-8 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} MedCore. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default HomeDashboard;