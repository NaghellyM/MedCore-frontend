
import { Search, User, Clock, ChevronRight, Mail, Phone, IdCard } from "lucide-react";
import { usePatientSearch } from "../../../../core/types/medicalHistory/usePatientSearch";
import type { PatientSearchResult } from "../../../../core/types/patient";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

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
            <Card className={`border-slate-200 shadow-sm ${className}`}>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Paciente Seleccionado</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSelection}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                            Cambiar paciente
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg text-slate-900 mb-2">
                                    {selectedPatient.fullname}
                                </h4>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <IdCard className="w-4 h-4 text-slate-400" />
                                        <span>CC: {selectedPatient.identificacion.toLocaleString()}</span>
                                    </div>
                                    {selectedPatient.email && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            <span className="truncate">{selectedPatient.email}</span>
                                        </div>
                                    )}
                                    {selectedPatient.phone && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span>{selectedPatient.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                <ChevronRight className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-slate-200 shadow-sm ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Buscar Paciente</CardTitle>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Busque por nombre, documento o número de historia
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Barra de búsqueda */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Ej: Juan Pérez, 12345678, HC-001234..."
                        value={query}
                        onChange={(e) => searchPatients(e.target.value)}
                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    />
                    {isSearching && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Error de búsqueda */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Resultados de búsqueda */}
                {showResults && (
                    <div className="space-y-3">
                        {results.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-slate-700">
                                        Resultados encontrados
                                    </h4>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                        {results.length} paciente{results.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
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
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-slate-400" />
                                </div>
                                <p className="text-sm font-medium text-slate-700 mb-1">
                                    No se encontraron resultados
                                </p>
                                <p className="text-xs text-slate-500">
                                    No hay pacientes con el término "{query}"
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* Pacientes recientes */}
                {!query && recentPatients.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <h4 className="text-sm font-medium text-slate-700">
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
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                            Comience a buscar
                        </p>
                        <p className="text-xs text-slate-500">
                            Escriba el nombre, documento o historia del paciente
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
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
            className={`
                w-full text-left rounded-xl border border-slate-200 
                hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${isCompact ? "p-3" : "p-4"}
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`
                    ${isCompact ? "w-9 h-9" : "w-11 h-11"} 
                    bg-gradient-to-br from-slate-100 to-slate-50 
                    rounded-lg flex items-center justify-center flex-shrink-0
                    border border-slate-200
                `}>
                    <User className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-slate-500`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className={`font-medium text-slate-900 truncate ${isCompact ? "text-sm" : ""}`}>
                        {patient.fullname}
                    </h5>
                    <div className={`flex flex-wrap gap-x-3 gap-y-0.5 ${isCompact ? "text-xs" : "text-sm"} text-slate-500`}>
                        <span className="flex items-center gap-1">
                            <IdCard className="w-3 h-3" />
                            {patient.identificacion.toLocaleString()}
                        </span>
                        {patient.historyNumber && (
                            <span>HC: {patient.historyNumber}</span>
                        )}
                    </div>
                    {!isCompact && patient.email && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                            {patient.email}
                        </p>
                    )}
                </div>
                <div className={`
                    ${isCompact ? "w-6 h-6" : "w-7 h-7"} 
                    bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0
                    group-hover:bg-blue-100 transition-colors
                `}>
                    <ChevronRight className={`${isCompact ? "w-3.5 h-3.5" : "w-4 h-4"} text-slate-400`} />
                </div>
            </div>
        </button>
    );
}