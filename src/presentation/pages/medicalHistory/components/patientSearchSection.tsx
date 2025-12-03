
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
            <Card className={`border-border bg-card shadow-sm ${className}`}>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Paciente Seleccionado</CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSelection}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                        >
                            Cambiar paciente
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-5 border border-primary/20">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <User className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg text-foreground mb-2">
                                    {selectedPatient.fullname}
                                </h4>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <IdCard className="w-4 h-4" />
                                        <span>CC: {selectedPatient.identificacion.toLocaleString()}</span>
                                    </div>
                                    {selectedPatient.email && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{selectedPatient.email}</span>
                                        </div>
                                    )}
                                    {selectedPatient.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span>{selectedPatient.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                                <ChevronRight className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-border bg-card shadow-sm ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Buscar Paciente</CardTitle>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Busque por nombre, documento o número de historia
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Barra de búsqueda */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Ej: Juan Pérez, 12345678, HC-001234..."
                        value={query}
                        onChange={(e) => searchPatients(e.target.value)}
                        className="pl-10 h-11 bg-background border-input focus:bg-background transition-colors"
                    />
                    {isSearching && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                        </div>
                    )}
                </div>

                {/* Error de búsqueda */}
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {/* Resultados de búsqueda */}
                {showResults && (
                    <div className="space-y-3">
                        {results.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-foreground">
                                        Resultados encontrados
                                    </h4>
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
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
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                    No se encontraron resultados
                                </p>
                                <p className="text-xs text-muted-foreground">
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
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <h4 className="text-sm font-medium text-foreground">
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
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Comience a buscar
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                w-full text-left rounded-xl border border-border bg-card
                hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
                ${isCompact ? "p-3" : "p-4"}
            `}
        >
            <div className="flex items-center gap-3">
                <div className={`
                    ${isCompact ? "w-9 h-9" : "w-11 h-11"} 
                    bg-gradient-to-br from-muted to-muted/50 
                    rounded-lg flex items-center justify-center flex-shrink-0
                    border border-border
                `}>
                    <User className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-muted-foreground`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className={`font-medium text-foreground truncate ${isCompact ? "text-sm" : ""}`}>
                        {patient.fullname}
                    </h5>
                    <div className={`flex flex-wrap gap-x-3 gap-y-0.5 ${isCompact ? "text-xs" : "text-sm"} text-muted-foreground`}>
                        <span className="flex items-center gap-1">
                            <IdCard className="w-3 h-3" />
                            {patient.identificacion.toLocaleString()}
                        </span>
                        {patient.historyNumber && (
                            <span>HC: {patient.historyNumber}</span>
                        )}
                    </div>
                    {!isCompact && patient.email && (
                        <p className="text-xs text-muted-foreground/70 truncate mt-0.5">
                            {patient.email}
                        </p>
                    )}
                </div>
                <div className={`
                    ${isCompact ? "w-6 h-6" : "w-7 h-7"} 
                    bg-muted rounded-full flex items-center justify-center flex-shrink-0
                    group-hover:bg-primary/10 transition-colors
                `}>
                    <ChevronRight className={`${isCompact ? "w-3.5 h-3.5" : "w-4 h-4"} text-muted-foreground`} />
                </div>
            </div>
        </button>
    );
}