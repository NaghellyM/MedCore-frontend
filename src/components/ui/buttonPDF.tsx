const ButtonPDF = () => {
    return (
        <button className="mt-2 ml-4 text-black font-semibold bg-red-200 border-cuidarte-accent border-1 rounded-md p-2">
            Descargar PDF
        </button>
    );
};
const ButtonViewDetails = () => {
    return (
        <button className="mt-2 ml-4 text-black font-semibold bg-cuidarte-tertiary border-cuidarte-accent border-1 rounded-md p-2">
            Ver más detalles
        </button>
    );
};

export  {ButtonPDF, ButtonViewDetails};