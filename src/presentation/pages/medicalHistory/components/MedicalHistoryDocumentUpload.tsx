import React from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Clock, Plus } from 'lucide-react';
import { useMedicalHistoryDocuments } from '../hooks/useMedicalHistoryDocuments';

interface MedicalHistoryDocumentUploadProps {
    patientId?: string;
    onUploadSuccess?: (documentId: string) => void;
    onUploadError?: (error: string) => void;
}

export function MedicalHistoryDocumentUpload({
    patientId,
    onUploadSuccess,
    onUploadError,
}: MedicalHistoryDocumentUploadProps) {
    
    const {
        documents,
        isUploading,
        addFiles,
        removeDocument,
        uploadPendingDocuments,
        hasPendingDocuments
    } = useMedicalHistoryDocuments({
        patientId,
        onUploadSuccess,
        onUploadError
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            addFiles(files);
        }
        // Reset input
        event.target.value = '';
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            addFiles(files);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    return (
        <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Documentos Adjuntos</h3>
                        <p className="text-sm text-gray-600">Subir archivos relacionados con el diagnóstico</p>
                    </div>
                </div>
                
                {hasPendingDocuments && (
                    <button
                        onClick={uploadPendingDocuments}
                        disabled={isUploading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        {isUploading ? (
                            <>
                                <Clock className="w-4 h-4 animate-spin" />
                                Subiendo...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Subir Todos
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Zona de drop */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
                <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900">
                            Arrastra archivos aquí o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            PDF, JPG, PNG - máximo 10MB por archivo
                        </p>
                    </div>
                </label>
            </div>

            {/* Lista de documentos */}
            {documents.length > 0 && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Archivos Adjuntos ({documents.length})
                    </h4>
                    <div className="space-y-2">
                        {documents.map((document, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {document.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(document.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {document.uploading && (
                                        <div className="flex items-center gap-2 text-blue-600">
                                            <Clock className="w-4 h-4 animate-spin" />
                                            <span className="text-xs">Subiendo...</span>
                                        </div>
                                    )}
                                    
                                    {document.uploaded && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-xs">Subido</span>
                                        </div>
                                    )}
                                    
                                    {document.error && (
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-xs">Error</span>
                                        </div>
                                    )}
                                    
                                    {!document.uploaded && (
                                        <button
                                            onClick={() => removeDocument(index)}
                                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Información adicional */}
            {!patientId && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <p className="text-sm text-yellow-800">
                            Los documentos se subirán después de crear la historia clínica y obtener el ID del diagnóstico.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}