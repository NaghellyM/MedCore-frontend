/**
 * EXPORTACIONES DE COMPONENTES DE HISTORIA MÉDICA - SOLO LECTURA
 * ===============================================================
 * Componentes especializados sin capacidad de edición
 */

// Componentes de estado
export { LoadingState, ErrorState, EmptyState, CardContainer } from "./StateComponents";

// Componentes de historia clínica
export { MedicalHistoryHeader } from "./MedicalHistoryHeader";
export { MedicalHistoryInfoCard } from "./MedicalHistoryInfoCard";

// Componentes de diagnósticos - Solo lectura
export { DiagnosticReadView } from "./DiagnosticReadView";
export { DiagnosticCard } from "./DiagnosticCard";
export { DiagnosticsSection } from "./DiagnosticsSection";

// Componentes de búsqueda
export { PatientSearchSection } from "./patientSearchSection";
