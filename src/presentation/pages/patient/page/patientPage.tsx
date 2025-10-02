import { Search } from "lucide-react";
import { ButtonPDF, ButtonViewDetails } from "../../../components/globals/buttonPDF";

export function PatientPageContent() {
    return (
        <div className="">
            <div className="p-8 bg-white max-w-lg mx-auto ">
                <div className="flex-1 max-w-md mx-4 hidden md:flex justify-center">
                    <input
                        type="text"
                        placeholder="Electrocardiogram, Análisis de sangre..."
                        className="w-full border border-slate-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cuidarte-primary"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Search />
                    </div>
                    <div className="ml-4">
                        <select className="border border-slate-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cuidarte-primary">
                            <option value="last_24_hours">Últimas 24 horas</option>
                            <option value="last_week">Última semana</option>
                            <option value="last_month">Últimos 30 días</option>
                        </select>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">
                                Examen de Sangre - 01/09/2023
                            </h3>
                            <p className="text-sm text-gray-600">
                                Resultados: Todo dentro de los parámetros normales.
                            </p>
                            <ButtonViewDetails />
                            <ButtonPDF />
                        </div>
                        <div className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">
                                Radiografía de Tórax - 15/08/2023
                            </h3>
                            <p className="text-sm text-gray-600">
                                Resultados: No se observan anomalías.
                            </p>
                            <ButtonViewDetails />
                            <ButtonPDF />
                        </div>
                        <div className="p-4 border rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold">
                                Análisis de Orina - 30/07/2023
                            </h3>
                            <p className="text-sm text-gray-600">
                                Resultados: Leve presencia de proteínas.
                            </p>
                            <ButtonViewDetails />
                            <ButtonPDF />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
