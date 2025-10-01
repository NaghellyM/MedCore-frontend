import React from "react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header
            className="fixed top-0 left-0 right-0 w-full bg-white shadow-md px-6 py-3 flex items-center justify-between"
            style={{ "--header-height": "64px" } as React.CSSProperties}
        >
            <div className="flex items-center flex-shrink-0">
                <img
                    src="/src/assets/images/Cuidarte_vive_al_100.png"
                    alt="logo-cuidarte"
                    className="w-20 h-20 object-contain"
                />
                <div className="flex-1 max-w-md mx-4 relative hidden md:flex justify-center ml-4 text-2xl font-bold text-cuidarte-primary ">
                    <h1 className="text-center">Cuidarte</h1>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => navigate("/login")} className="bg-cuidarte-accent text-white px-4 py-2 rounded-md hover:bg-cuidarte-accent-dark">Iniciar Sesión</button>
            </div>
        </header>
    );
};

export default Header;
