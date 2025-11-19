
import { Search, User, Clock, ChevronRight } from "lucide-react";
import { usePatientSearch } from "../../../../core/types/medicalHistory/usePatientSearch";
import type { PatientSearchResult } from "../../../../core/types/patient";

interface PatientSearchSectionProps {
    onPatientSelect: (patient: PatientSearchResult) => void;
    selectedPatient?: PatientSearchResult | null;
    className?: string;
}

export function PatientSearchSection({ 
    onPatientSelect, 
    selectedPatient, 
    className = "" 
}: PatientSearchSectionProps) {
    const {
        query,
        results,
        isSearching,
        showResults,
        recentPatients,
        error,
        searchPatients,
        selectPatient,
        clearSelection
    } = usePatientSearch({
        debounceMs: 300,
        minQueryLength: 2,
        autoLoadRecent: true
    });

    const handlePatientSelect = (patient: PatientSearchResult) => {
        selectPatient(patient);
        onPatientSelect(patient);
    };

    const handleClearSelection = () => {
        clearSelection();
    };

    if (selectedPatient) {
        return (
            <div className={`bg-white rounded-lg border p-6 ${className}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Paciente Seleccionado
                    </h3>
                    <button
                        onClick={handleClearSelection}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Cambiar paciente
                    </button>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                                {selectedPatient.fullname}
                            </h4>
                            <p className="text-sm text-gray-600">
                                CC: {selectedPatient.identificacion.toLocaleString()}
                            </p>
                            {selectedPatient.email && (
                                <p className="text-sm text-gray-600">
                                    {selectedPatient.email}
                                </p>
                            )}
                            {selectedPatient.phone && (
                                <p className="text-sm text-gray-600">
                                    Tel: {selectedPatient.phone}
                                </p>
                            )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg border p-6 ${className}`}>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Buscar Paciente
                </h3>
                <p className="text-sm text-gray-600">
                    Busque por nombre completo, número de documento o número de historia clínica
                </p>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Ej: Juan Pérez, 12345678, HC-001234..."
                    value={query}
                    onChange={(e) => searchPatients(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             placeholder-gray-400 text-sm"
                />
                {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            {/* Error de búsqueda */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Resultados de búsqueda */}
            {showResults && (
                <div className="space-y-2">
                    {results.length > 0 ? (
                        <>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Resultados de búsqueda ({results.length})
                            </h4>
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {results.map((patient) => (
                                    <PatientCard
                                        key={patient.id}
                                        patient={patient}
                                        onClick={() => handlePatientSelect(patient)}
                                    />
                                ))}
                            </div>
                        </>
                    ) : query && !isSearching ? (
                        <div className="text-center py-8">
                            <User className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-500">
                                No se encontraron pacientes con el término "{query}"
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Verifique la ortografía o intente con otros términos
                            </p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Pacientes recientes */}
            {!query && recentPatients.length > 0 && (
                <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <h4 className="text-sm font-medium text-gray-700">
                            Pacientes recientes
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {recentPatients.map((patient) => (
                            <PatientCard
                                key={patient.id}
                                patient={patient}
                                onClick={() => handlePatientSelect(patient)}
                                variant="compact"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {!query && recentPatients.length === 0 && (
                <div className="text-center py-8">
                    <Search className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 mb-1">
                        Comience escribiendo para buscar pacientes
                    </p>
                    <p className="text-xs text-gray-400">
                        Puede buscar por nombre, documento o número de historia
                    </p>
                </div>
            )}
        </div>
    );
}

interface PatientCardProps {
    patient: PatientSearchResult;
    onClick: () => void;
    variant?: "default" | "compact";
}

function PatientCard({ patient, onClick, variant = "default" }: PatientCardProps) {
    const isCompact = variant === "compact";

    return (
        <button
            onClick={onClick}
            className="w-full text-left p-3 border border-gray-200 rounded-lg 
                     hover:border-blue-300 hover:bg-blue-50 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            <div className="flex items-center gap-3">
                <div className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} 
                               bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <User className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-gray-600`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className={`font-medium text-gray-900 truncate ${isCompact ? "text-sm" : ""}`}>
                        {patient.fullname}
                    </h5>
                    <div className={`flex gap-4 ${isCompact ? "text-xs" : "text-sm"} text-gray-600`}>
                        <span>CC: {patient.identificacion.toLocaleString()}</span>
                        {patient.historyNumber && (
                            <span>HC: {patient.historyNumber}</span>
                        )}
                    </div>
                    {!isCompact && patient.email && (
                        <p className="text-xs text-gray-500 truncate">
                            {patient.email}
                        </p>
                    )}
                </div>
                <ChevronRight className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-gray-400 flex-shrink-0`} />
            </div>
        </button>
    );
}