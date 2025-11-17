import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { useDocumentUpload } from "../../../../core/types/documents/useDocumentUpload";

interface DocumentUploadComponentProps {
    patientId?: string;
    diagnosticId?: string;
    onUploadSuccess?: (documentId: string) => void;
    onUploadError?: (error: string) => void;
    title?: string;
    description?: string;
    showUploadAll?: boolean;
    className?: string;
}

export function DocumentUploadComponent({
    patientId,
    diagnosticId,
    onUploadSuccess,
    onUploadError,
    title = "Cargar Documentos",
    description = "Adjunte archivos PDF, JPG o PNG (máximo 10MB cada uno)",
    showUploadAll = true,
    className = ""
}: DocumentUploadComponentProps) {
    const {
        documents,
        isUploading,
        addFiles,
        removeDocument,
        uploadDocument,
        uploadAllDocuments
    } = useDocumentUpload({
        patientId,
        diagnosticId,
        onUploadSuccess,
        onUploadError
    });

    const handleFileSelect = (files: FileList | null) => {
        if (files) {
            addFiles(files);
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        return '📎';
    };

    const pendingUploads = documents.filter(doc => !doc.uploaded && !doc.uploading);

    return (
        <div className={`bg-white rounded-lg border p-6 ${className}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>

            {/* Zona de carga */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                    <label className="text-blue-600 hover:text-blue-700 cursor-pointer">
                        Selecciona archivos
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileSelect(e.target.files)}
                            className="hidden"
                        />
                    </label>
                    {" "}o arrastra archivos aquí
                </p>
                <p className="text-xs text-gray-500">
                    PDF, JPG, PNG - Máximo 10MB por archivo
                </p>
            </div>

            {/* Lista de archivos */}
            {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">
                            Archivos ({documents.length})
                        </h4>
                        {showUploadAll && pendingUploads.length > 0 && (
                            <button
                                onClick={uploadAllDocuments}
                                disabled={isUploading}
                                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                            >
                                {isUploading ? "Subiendo..." : `Subir Todos (${pendingUploads.length})`}
                            </button>
                        )}
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {documents.map((document, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className="text-lg flex-shrink-0">
                                        {getFileIcon(document.file.type)}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {document.file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(document.file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        {document.error && (
                                            <p className="text-xs text-red-600 truncate">
                                                {document.error}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {document.uploading && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    )}
                                    
                                    {document.uploaded && (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-green-600">Subido</span>
                                        </div>
                                    )}
                                    
                                    {document.error && (
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    
                                    {!document.uploaded && !document.uploading && (
                                        <button
                                            onClick={() => uploadDocument(index)}
                                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Subir
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={() => removeDocument(index)}
                                        className="p-1 text-gray-400 hover:text-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Resumen de estado */}
            {documents.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">
                            Total: {documents.length} archivo{documents.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex gap-4 text-xs">
                            <span className="text-green-600">
                                ✓ Subidos: {documents.filter(d => d.uploaded).length}
                            </span>
                            <span className="text-blue-600">
                                ⏳ Pendientes: {pendingUploads.length}
                            </span>
                            {documents.some(d => d.error) && (
                                <span className="text-red-600">
                                    ✗ Con errores: {documents.filter(d => d.error).length}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}