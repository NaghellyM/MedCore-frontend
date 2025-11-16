import { useState, useCallback, useEffect } from "react";
import { diagnosticService } from "../../../../core/services/diagnosticService";
import { useDocumentUpload } from "./useDocumentUpload";
import type { DocumentFile } from "./useDocumentUpload";

interface UseMedicalHistoryDocumentsProps {
    patientId?: string;
    onUploadSuccess?: (documentId: string) => void;
    onUploadError?: (error: string) => void;
}

interface UseMedicalHistoryDocumentsReturn {
    documents: DocumentFile[];
    isUploading: boolean;
    error: string | null;
    addFiles: (files: FileList) => void;
    removeDocument: (index: number) => void;
    uploadPendingDocuments: () => Promise<void>;
    hasPendingDocuments: boolean;
    clearDocuments: () => void;
}

/**
 * Hook especializado para manejar documentos en historias clínicas
 * Se integra con el flujo de creación de historia clínica para subir documentos
 * después de obtener el ID del diagnóstico creado
 */
export function useMedicalHistoryDocuments({
    patientId,
    onUploadSuccess,
    onUploadError
}: UseMedicalHistoryDocumentsProps): UseMedicalHistoryDocumentsReturn {
    
    const [diagnosticId, setDiagnosticId] = useState<string | undefined>();
    const [isSearchingDiagnostic, setIsSearchingDiagnostic] = useState(false);
    
    const {
        documents,
        isUploading,
        addFiles,
        removeDocument,
        uploadDocument,
        clearDocuments
    } = useDocumentUpload({
        patientId,
        diagnosticId,
        onUploadSuccess,
        onUploadError
    });

    // Buscar el diagnóstico más reciente del paciente
    const findLatestDiagnostic = useCallback(async () => {
        if (!patientId || isSearchingDiagnostic || diagnosticId) return;
        
        setIsSearchingDiagnostic(true);
        try {
            const response = await diagnosticService.getDiagnosticsByPatientId(patientId);
            if (response.data && response.data.length > 0) {
                // Usar el diagnóstico más reciente (primero en la lista)
                const latestDiagnostic = response.data[0];
                setDiagnosticId(latestDiagnostic.id);
            }
        } catch (error) {
            // Si no se pueden obtener diagnósticos, continuar sin diagnostic ID
        } finally {
            setIsSearchingDiagnostic(false);
        }
    }, [patientId, isSearchingDiagnostic, diagnosticId]);

    // Subir todos los documentos pendientes
    const uploadPendingDocuments = useCallback(async () => {
        if (!diagnosticId && patientId) {
            // Intentar obtener el diagnóstico primero
            await findLatestDiagnostic();
        }

        // Subir documentos que no han sido subidos
        const pendingDocuments = documents.filter(doc => !doc.uploaded && !doc.uploading);
        
        for (let i = 0; i < pendingDocuments.length; i++) {
            const docIndex = documents.findIndex(doc => doc === pendingDocuments[i]);
            if (docIndex !== -1) {
                await uploadDocument(docIndex);
            }
        }
    }, [diagnosticId, patientId, documents, findLatestDiagnostic, uploadDocument]);

    // Verificar si hay documentos pendientes de subir
    const hasPendingDocuments = documents.some(doc => !doc.uploaded && !doc.uploading);

    // Intentar encontrar el diagnóstico cuando se agreguen documentos
    useEffect(() => {
        if (documents.length > 0 && !diagnosticId && patientId) {
            findLatestDiagnostic();
        }
    }, [documents.length, diagnosticId, patientId, findLatestDiagnostic]);

    return {
        documents,
        isUploading: isUploading || isSearchingDiagnostic,
        error: null, // Manejar errores en el nivel superior
        addFiles,
        removeDocument,
        uploadPendingDocuments,
        hasPendingDocuments,
        clearDocuments
    };
}