import { useState, useCallback } from "react";
import { documentsService } from "../../../../core/services/documentsService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export interface DocumentFile {
    file: File;
    id?: string;
    uploading?: boolean;
    uploaded?: boolean;
    error?: string;
}

interface UseDocumentUploadOptions {
    patientId?: string;
    diagnosticId?: string;
    onUploadSuccess?: (documentId: string) => void;
    onUploadError?: (error: string) => void;
}

interface UseDocumentUploadReturn {
    documents: DocumentFile[];
    isUploading: boolean;
    addFiles: (files: FileList | File[]) => void;
    removeDocument: (index: number) => void;
    uploadDocument: (index: number) => Promise<void>;
    uploadAllDocuments: () => Promise<void>;
    clearDocuments: () => void;
    validateFile: (file: File) => string | null;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function useDocumentUpload(options: UseDocumentUploadOptions = {}): UseDocumentUploadReturn {
    const { patientId, diagnosticId, onUploadSuccess, onUploadError } = options;
    
    const [documents, setDocuments] = useState<DocumentFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const validateFile = useCallback((file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return "Tipo de archivo no permitido. Solo PDF, JPG, PNG.";
        }
        if (file.size > MAX_SIZE) {
            return "El archivo supera el tamaño máximo de 10MB.";
        }
        return null;
    }, []);

    const addFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const validFiles: DocumentFile[] = [];
        const errors: string[] = [];

        fileArray.forEach(file => {
            const error = validateFile(file);
            if (error) {
                errors.push(`${file.name}: ${error}`);
            } else {
                validFiles.push({ 
                    file, 
                    uploading: false, 
                    uploaded: false 
                });
            }
        });

        if (errors.length > 0) {
            MySwal.fire({
                icon: "error",
                title: "Archivos inválidos",
                html: errors.join("<br>"),
            });
            onUploadError?.(errors.join(", "));
            return;
        }

        setDocuments(prev => [...prev, ...validFiles]);
    }, [validateFile, onUploadError]);

    const removeDocument = useCallback((index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    }, []);

    const uploadDocument = useCallback(async (index: number) => {
        if (!patientId) {
            const error = "No se ha especificado un paciente válido";
            onUploadError?.(error);
            console.warn("Intentando subir documento sin patientId:", { patientId, diagnosticId });
            return;
        }

        const document = documents[index];
        if (!document || document.uploaded || document.uploading) {
            return;
        }

        // Actualizar estado a "subiendo"
        setDocuments(prev => prev.map((doc, i) => 
            i === index ? { ...doc, uploading: true, error: undefined } : doc
        ));

        setIsUploading(true);

        try {
            // Usar diagnosticId si está disponible, sino crear uno temporal
            const finalDiagnosticId = diagnosticId || `temp-diagnostic-${Date.now()}`;
            

            
            // Validar que tenemos IDs reales antes de subir
            if (!patientId || patientId === 'unknown' || !finalDiagnosticId || finalDiagnosticId.startsWith('temp-')) {
                throw new Error(`IDs inválidos para carga de documentos. PatientId: ${patientId}, DiagnosticId: ${finalDiagnosticId}`);
            }
            
            const response = await documentsService.uploadDocuments({
                patientId,
                diagnosticId: finalDiagnosticId,
                files: [document.file]
            });



            // Actualizar estado a "subido"
            setDocuments(prev => prev.map((doc, i) => 
                i === index ? { 
                    ...doc, 
                    uploading: false, 
                    uploaded: true,
                    error: undefined,
                    id: response.data?.documentId
                } : doc
            ));

            onUploadSuccess?.(response.data?.documentId);



        } catch (error) {
            console.error("Error al subir documento:", error);
            
            let errorMessage = "Error al subir el archivo";
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                if (axiosError.response?.status === 500) {
                    errorMessage = "Error del servidor. Verifique que el backend esté funcionando correctamente.";
                } else if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            setDocuments(prev => prev.map((doc, i) => 
                i === index ? { 
                    ...doc, 
                    uploading: false, 
                    error: errorMessage 
                } : doc
            ));

            onUploadError?.(errorMessage);
            
            // No mostrar popup de error para no interrumpir el flujo
            console.warn(`Error al subir ${document.file.name}:`, errorMessage);
        } finally {
            setIsUploading(false);
        }
    }, [documents, patientId, diagnosticId, onUploadSuccess, onUploadError]);

    const uploadAllDocuments = useCallback(async () => {
        const pendingUploads = documents
            .map((doc, index) => ({ doc, index }))
            .filter(({ doc }) => !doc.uploaded && !doc.uploading);

        if (pendingUploads.length === 0) {
            return;
        }

        setIsUploading(true);

        try {
            // Subir documentos en secuencia para evitar sobrecarga
            for (const { index } of pendingUploads) {
                await uploadDocument(index);
            }
        } finally {
            setIsUploading(false);
        }
    }, [documents, uploadDocument]);

    const clearDocuments = useCallback(() => {
        setDocuments([]);
    }, []);

    return {
        documents,
        isUploading,
        addFiles,
        removeDocument,
        uploadDocument,
        uploadAllDocuments,
        clearDocuments,
        validateFile
    };
}