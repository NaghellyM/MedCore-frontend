/**
 * VALIDADOR DE DOCUMENTOS
 * Centraliza toda la lógica de validación para operaciones con documentos
 * Separa las validaciones del service para mantener responsabilidades claras
 */

import type { UploadDocumentsParams } from "../services/documentsService";

export class DocumentValidator {
    // Expresión regular para validar UUIDs
    private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    // Tipos de archivo permitidos (extensiones)
    private static readonly ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
    
    // Tamaño máximo por archivo (10MB)
    private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024;
    
    // Número máximo de archivos por upload
    private static readonly MAX_FILES_COUNT = 5;

    /**
     * Valida los parámetros completos para upload de documentos
     * @param params - Parámetros del upload
     * @throws Error si alguna validación falla
     */
    static validateUploadParams(params: UploadDocumentsParams): void {
        this.validatePatientId(params.patientId);
        this.validateDiagnosticId(params.diagnosticId);
        this.validateFiles(params.files);
    }

    /**
     * Valida que el patientId sea válido
     * @param patientId - ID del paciente
     * @throws Error si no es válido
     */
    static validatePatientId(patientId: string): void {
        if (!patientId || typeof patientId !== 'string') {
            throw new Error("El ID del paciente es requerido para subir documentos");
        }

        if (patientId.trim().length === 0) {
            throw new Error("El ID del paciente no puede estar vacío");
        }
    }

    /**
     * Valida que el diagnosticId sea válido
     * @param diagnosticId - ID del diagnóstico
     * @throws Error si no es válido
     */
    static validateDiagnosticId(diagnosticId: string): void {
        if (!diagnosticId || typeof diagnosticId !== 'string') {
            throw new Error("El ID del diagnóstico es requerido para subir documentos");
        }

        // Validación crítica: no puede ser temporal
        if (diagnosticId.startsWith('temp-')) {
            throw new Error(
                `ID de diagnóstico inválido: "${diagnosticId}". ` +
                `Debe ser un UUID real del backend, no un ID temporal. ` +
                `No se pueden subir documentos con ID temporal.`
            );
        }

        // Validar formato UUID
        if (!this.UUID_REGEX.test(diagnosticId)) {
            throw new Error(
                `El ID del diagnóstico "${diagnosticId}" no tiene formato UUID válido. ` +
                `Debe ser un UUID generado por el backend.`
            );
        }
    }

    /**
     * Valida los archivos a subir
     * @param files - Array de archivos
     * @throws Error si la validación falla
     */
    static validateFiles(files: File[]): void {
        if (!files || !Array.isArray(files)) {
            throw new Error("Se requiere al menos un archivo para subir");
        }

        if (files.length === 0) {
            throw new Error("Se requiere al menos un archivo para subir");
        }

        if (files.length > this.MAX_FILES_COUNT) {
            throw new Error(`No se pueden subir más de ${this.MAX_FILES_COUNT} archivos a la vez`);
        }

        // Validar cada archivo individualmente
        files.forEach((file, index) => this.validateSingleFile(file, index));
    }

    /**
     * Valida un archivo individual
     * @param file - Archivo a validar
     * @param index - Índice del archivo (para mensajes de error)
     * @throws Error si la validación falla
     */
    static validateSingleFile(file: File, index: number = 0): void {
        const fileLabel = `Archivo ${index + 1}`;

        if (!file || !(file instanceof File)) {
            throw new Error(`${fileLabel}: Archivo inválido`);
        }

        // Validar nombre del archivo
        if (!file.name || file.name.trim().length === 0) {
            throw new Error(`${fileLabel}: El nombre del archivo no puede estar vacío`);
        }

        // Validar tamaño del archivo
        if (file.size === 0) {
            throw new Error(`${fileLabel} "${file.name}": El archivo no puede estar vacío`);
        }

        if (file.size > this.MAX_FILE_SIZE) {
            const maxSizeMB = this.MAX_FILE_SIZE / (1024 * 1024);
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            throw new Error(
                `${fileLabel} "${file.name}": Tamaño demasiado grande (${fileSizeMB}MB). ` +
                `El tamaño máximo permitido es ${maxSizeMB}MB`
            );
        }

        // Validar extensión del archivo
        const fileExtension = this.getFileExtension(file.name);
        if (!this.ALLOWED_EXTENSIONS.includes(fileExtension)) {
            throw new Error(
                `${fileLabel} "${file.name}": Tipo de archivo no permitido (${fileExtension}). ` +
                `Tipos permitidos: ${this.ALLOWED_EXTENSIONS.join(', ')}`
            );
        }

        // Validar tipo MIME si está disponible
        this.validateMimeType(file, fileLabel);
    }

    /**
     * Valida el tipo MIME del archivo
     * @param file - Archivo a validar
     * @param fileLabel - Etiqueta para mensajes de error
     */
    private static validateMimeType(file: File, fileLabel: string): void {
        const allowedMimeTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.type && !allowedMimeTypes.includes(file.type)) {
            throw new Error(
                `${fileLabel} "${file.name}": Tipo MIME no permitido (${file.type}). ` +
                `Asegúrese de que el archivo sea PDF, imagen (JPG/PNG) o documento Word.`
            );
        }
    }

    /**
     * Obtiene la extensión de un archivo
     * @param filename - Nombre del archivo
     * @returns Extensión en minúsculas con punto
     */
    private static getFileExtension(filename: string): string {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return '';
        }
        return filename.substring(lastDotIndex).toLowerCase();
    }

    /**
     * Valida un ID de documento para operaciones de lectura/descarga
     * @param documentId - ID del documento
     * @throws Error si no es válido
     */
    static validateDocumentId(documentId: string): void {
        if (!documentId || typeof documentId !== 'string') {
            throw new Error("El ID del documento es requerido");
        }

        if (documentId.trim().length === 0) {
            throw new Error("El ID del documento no puede estar vacío");
        }

        // Opcional: validar formato UUID si se requiere
        if (!this.UUID_REGEX.test(documentId)) {
            throw new Error(`El ID del documento "${documentId}" no tiene formato UUID válido`);
        }
    }

    /**
     * Valida parámetros para descarga de versión específica
     * @param documentId - ID del documento
     * @param version - Número de versión
     * @throws Error si no es válido
     */
    static validateVersionDownload(documentId: string, version: number): void {
        this.validateDocumentId(documentId);

        if (!Number.isInteger(version) || version < 1) {
            throw new Error("El número de versión debe ser un entero positivo");
        }
    }
}