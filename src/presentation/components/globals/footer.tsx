import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="mt-8 text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Cuidarte. Todos los derechos reservados.
        </footer>
    );
};

export default Footer;
