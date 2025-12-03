/**
 * ÍNDICE DE HOOKS - DIAGNÓSTICOS
 * ===============================
 * Exportaciones centralizadas para hooks de diagnósticos
 * NOTA: Los diagnósticos NO se pueden crear ni editar, solo visualizar y eliminar
 */

export { useDiagnostics } from './useDiagnostics';
export { useDiagnostic } from './useDiagnostic';
export { useDiagnosticsByPatient } from './useDiagnosticsByPatient';
// useDiagnosticForm eliminado - los diagnósticos no se pueden crear/editar
export { useDeleteDiagnostic } from './useDeleteDiagnostic';
export { useDiagnosticFilter } from './useDiagnosticFilter';
export { usePredefinedDiagnostics } from './usePredefinedDiagnostics';
export { useAssignDiagnostics } from './useAssignDiagnostics';