/**
 * MENSAJES DE ERROR CENTRALIZADOS
 * ===============================
 * Todos los mensajes de error relacionados con historias médicas
 */

export const MEDICAL_HISTORY_ERRORS = {
    // Errores de carga
    LOAD_HISTORY: "No se pudo cargar la historia clínica",
    LOAD_HISTORY_INVALID_ID: "ID de historia clínica no válido",
    LOAD_PATIENT: "No se pudo cargar la información del paciente",
    LOAD_HISTORIES_LIST: "Error al cargar las historias clínicas",
    LOAD_SUMMARY: "Error al cargar el resumen médico",
    
    // Errores de guardado
    SAVE_HISTORY: "Error al guardar la historia clínica",
    SAVE_DIAGNOSTIC: "Error al guardar el diagnóstico",
    UPDATE_HISTORY: "Error al actualizar la historia clínica",
    UPDATE_DIAGNOSTIC: "Error al actualizar el diagnóstico",
    
    // Errores de eliminación
    DELETE_DIAGNOSTIC: "Error al eliminar el diagnóstico",
    
    // Errores de validación
    INVALID_FORM: "Formulario incompleto o con errores",
    MISSING_PATIENT: "Debe seleccionar un paciente",
    MISSING_REQUIRED_FIELDS: "Faltan campos obligatorios",
    
    // Errores de permisos
    UNAUTHORIZED: "No tiene permisos para realizar esta acción",
    FORBIDDEN: "Acceso denegado",
    
    // Errores de red
    NETWORK_ERROR: "Error de conexión. Verifique su conexión a internet",
    SERVER_ERROR: "Error del servidor. Intente nuevamente más tarde",
    TIMEOUT: "La solicitud ha excedido el tiempo de espera",
} as const;

export const MEDICAL_HISTORY_SUCCESS = {
    // Mensajes de éxito
    SAVE_HISTORY: "Historia clínica guardada exitosamente",
    UPDATE_HISTORY: "Historia clínica actualizada exitosamente",
    SAVE_DIAGNOSTIC: "Diagnóstico guardado exitosamente",
    UPDATE_DIAGNOSTIC: "Diagnóstico actualizado exitosamente",
    DELETE_DIAGNOSTIC: "Diagnóstico eliminado exitosamente",
} as const;

export const MEDICAL_HISTORY_INFO = {
    // Mensajes informativos
    LOADING: "Cargando historia clínica...",
    SAVING: "Guardando cambios...",
    NO_HISTORY: "Este paciente aún no tiene historia clínica registrada",
    NO_DIAGNOSTICS: "No hay diagnósticos registrados",
    NO_RESULTS: "No se encontraron historias clínicas",
    AUTO_CREATE: "La historia clínica se creará automáticamente al realizar la primera consulta",
} as const;

/**
 * Obtiene un mensaje de error personalizado basado en el código HTTP
 */
export function getHttpErrorMessage(statusCode?: number): string {
    switch (statusCode) {
        case 400:
            return "Solicitud inválida. Verifique los datos ingresados";
        case 401:
            return MEDICAL_HISTORY_ERRORS.UNAUTHORIZED;
        case 403:
            return MEDICAL_HISTORY_ERRORS.FORBIDDEN;
        case 404:
            return "Recurso no encontrado";
        case 408:
            return MEDICAL_HISTORY_ERRORS.TIMEOUT;
        case 500:
            return MEDICAL_HISTORY_ERRORS.SERVER_ERROR;
        case 503:
            return "Servicio no disponible. Intente más tarde";
        default:
            return MEDICAL_HISTORY_ERRORS.SERVER_ERROR;
    }
}
