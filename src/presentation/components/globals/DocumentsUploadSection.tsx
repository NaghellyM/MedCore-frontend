/**
 * SECCIÓN DE CARGA DE DOCUMENTOS
 * ==============================
 * Componente especializado para manejar la carga de documentos
 * Reutilizable en múltiples formularios del sistema
 */

import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import type { DocumentFile } from "../../../core/types/documents/useDocumentUpload";

interface DocumentsUploadSectionProps {
    documents: DocumentFile[];
    isUploading: boolean;
    isProcessing?: boolean;
    onAddFiles: (files: FileList) => void;
    onRemoveDocument: (index: number) => void;
    onClearDocuments: () => void;
    title?: string;
    description?: string;
    acceptedTypes?: string;
    maxFileSizeMB?: number;
    disabled?: boolean;
}

/**
 * Componente reutilizable para carga de documentos
 * Usado en historias médicas, diagnósticos, y otros formularios
 */
export function DocumentsUploadSection({
    documents,
    isUploading,
    isProcessing = false,
    onAddFiles,
    onRemoveDocument,
    onClearDocuments,
    title = "Documentos Adjuntos",
    description = "Adjunte imágenes, estudios o documentos relacionados (opcional)",
    acceptedTypes = ".pdf,.jpg,.jpeg,.png",
    maxFileSizeMB = 10,
    disabled = false
}: DocumentsUploadSectionProps) {

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            onAddFiles(files);
            // Limpiar el input para permitir seleccionar los mismos archivos otra vez
            event.target.value = '';
        }
    };

    const handleRemoveDocument = (index: number) => {
        if (!disabled && !isProcessing) {
            onRemoveDocument(index);
        }
    };

    const handleClearAll = () => {
        if (!disabled && !isProcessing && documents.length > 0) {
            onClearDocuments();
        }
    };

    // ========================================================================
    // COMPUTED VALUES
    // ========================================================================

    const isInteractionDisabled = disabled || isProcessing || isUploading;
    const uploadedCount = documents.filter(doc => doc.uploaded).length;
    const errorCount = documents.filter(doc => doc.error).length;
    const totalSizeMB = documents.reduce(
        (total, doc) => total + (doc.file.size / 1024 / 1024), 
        0
    );

    // ========================================================================
    // RENDER HELPERS
    // ========================================================================

    const getFileIcon = (file: File): string => {
        if (file.type.includes('pdf')) return '📄';
        if (file.type.includes('image')) return '🖼️';
        return '📎';
    };

    const getStatusBadge = (doc: DocumentFile) => {
        if (doc.uploaded) {
            return (
                <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Subido</span>
                </div>
            );
        }

        if (doc.error) {
            return (
                <div className="flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>Error</span>
                </div>
            );
        }

        if (isUploading) {
            return (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Subiendo...</span>
                </div>
            );
        }

        return (
            <span className="text-xs text-gray-500">
                Pendiente
            </span>
        );
    };

    // ========================================================================
    // MAIN RENDER
    // ========================================================================

    return (
        <div className="bg-white rounded-lg border p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {description}
                    </p>
                </div>
                {/* Statistics */}
                {documents.length > 0 && (
                    <div className="text-right text-sm text-gray-500">
                        <div>{documents.length} archivo{documents.length !== 1 ? 's' : ''}</div>
                        <div>{totalSizeMB.toFixed(1)} MB total</div>
                        {uploadedCount > 0 && (
                            <div className="text-green-600">{uploadedCount} subido{uploadedCount !== 1 ? 's' : ''}</div>
                        )}
                        {errorCount > 0 && (
                            <div className="text-red-600">{errorCount} error{errorCount !== 1 ? 'es' : ''}</div>
                        )}
                    </div>
                )}
            </div>

            {/* File Drop Zone */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isInteractionDisabled 
                    ? "border-gray-200 bg-gray-50" 
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}>
                <input
                    type="file"
                    multiple
                    accept={acceptedTypes}
                    onChange={handleFileChange}
                    className="hidden"
                    id="documents-upload"
                    disabled={isInteractionDisabled}
                />
                <label
                    htmlFor="documents-upload"
                    className={`block cursor-pointer ${
                        isInteractionDisabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-700"
                    }`}
                >
                    <Upload className="w-8 h-8 mx-auto mb-2 text-current" />
                    <div className="font-medium">
                        {isInteractionDisabled ? "Carga deshabilitada" : "Seleccionar archivos"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {acceptedTypes.replace(/\./g, '').toUpperCase()} - Máximo {maxFileSizeMB}MB por archivo
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        También puedes arrastrar archivos aquí
                    </div>
                </label>
            </div>

            {/* Documents List */}
            {documents.length > 0 && (
                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                            Archivos seleccionados
                        </h4>
                        {!isInteractionDisabled && (
                            <button
                                onClick={handleClearAll}
                                className="text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                                Limpiar todos
                            </button>
                        )}
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {documents.map((doc, index) => (
                            <div
                                key={`${doc.file.name}-${index}`}
                                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                    doc.uploaded 
                                        ? "bg-green-50 border-green-200" 
                                        : doc.error 
                                            ? "bg-red-50 border-red-200"
                                            : "bg-gray-50 border-gray-200"
                                }`}
                            >
                                {/* File Icon */}
                                <div className="text-xl flex-shrink-0">
                                    {getFileIcon(doc.file)}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {doc.file.name}
                                        </p>
                                        {getStatusBadge(doc)}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {(doc.file.size / 1024 / 1024).toFixed(2)} MB • {doc.file.type || 'Tipo desconocido'}
                                    </p>
                                    {doc.error && (
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {doc.error}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                {!doc.uploaded && !isInteractionDisabled && (
                                    <button
                                        onClick={() => handleRemoveDocument(index)}
                                        className="text-red-600 hover:text-red-700 text-sm px-2 py-1 rounded transition-colors flex-shrink-0"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-blue-700 font-medium">
                            Subiendo documentos...
                        </span>
                        <span className="text-xs text-blue-600 ml-auto">
                            {uploadedCount} de {documents.length} completados
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 bg-blue-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                                width: `${documents.length > 0 ? (uploadedCount / documents.length) * 100 : 0}%` 
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Upload Summary */}
            {documents.length > 0 && !isUploading && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            Total: {documents.length} archivo{documents.length !== 1 ? 's' : ''} 
                            ({totalSizeMB.toFixed(1)} MB)
                        </span>
                        <div className="flex gap-4 text-xs">
                            {uploadedCount > 0 && (
                                <span className="text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {uploadedCount} subido{uploadedCount !== 1 ? 's' : ''}
                                </span>
                            )}
                            {errorCount > 0 && (
                                <span className="text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errorCount} error{errorCount !== 1 ? 'es' : ''}
                                </span>
                            )}
                            {documents.length - uploadedCount - errorCount > 0 && (
                                <span className="text-gray-500">
                                    {documents.length - uploadedCount - errorCount} pendiente{(documents.length - uploadedCount - errorCount) !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}