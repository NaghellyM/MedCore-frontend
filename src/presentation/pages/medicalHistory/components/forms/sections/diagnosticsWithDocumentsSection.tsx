import { useState } from "react";
import { Stethoscope, Search, FileText, CheckCircle, Upload, X, AlertCircle } from "lucide-react";
import { useDocumentUpload } from "../../../hooks/useDocumentUpload";
import type { SectionProps } from "../../../../../../core/types/medicalHistory";

export function DiagnosticsWithDocumentsSection({ data, onUpdate, isReadOnly = false, errors }: SectionProps) {
    const [dragActive, setDragActive] = useState(false);

    const diagnostics = data.diagnostics || {
        symptoms: "",
        clinicalFindings: "",
        primaryDiagnosis: "",
        secondaryDiagnosis: "",
        diagnosticImpression: ""
    };

    // Hook para manejar la carga de documentos
    const {
        documents,
        isUploading,
        addFiles,
        removeDocument,
        uploadDocument,
        uploadAllDocuments
    } = useDocumentUpload({
        patientId: data.patientInfo?.id,
        diagnosticId: `temp-diagnostic-${Date.now()}`, // Temporal hasta tener ID real
        onUploadSuccess: (documentId) => {
            console.log("Documento subido exitosamente:", documentId);
        },
        onUploadError: (error) => {
            console.error("Error al subir documento:", error);
        }
    });

    const handleInputChange = (field: keyof typeof diagnostics, value: string) => {
        if (isReadOnly) return;
        
        onUpdate({
            ...data,
            diagnostics: {
                ...diagnostics,
                [field]: value
            }
        });
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files || isReadOnly) return;
        addFiles(files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!dragActive) setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('image')) return '🖼️';
        return '📎';
    };

    return (
        <div className="space-y-6">
            {/* Sección de Diagnósticos */}
            <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Diagnósticos y Hallazgos Clínicos
                    </h3>
                </div>

                <div className="space-y-6">
                    {/* Síntomas */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Search className="w-4 h-4" />
                            Síntomas Reportados
                        </label>
                        <textarea
                            value={diagnostics.symptoms}
                            onChange={(e) => handleInputChange("symptoms", e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Liste los síntomas reportados por el paciente..."
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                        border-gray-300`}
                        />
                    </div>

                    {/* Hallazgos Clínicos */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4" />
                            Hallazgos Clínicos
                        </label>
                        <textarea
                            value={diagnostics.clinicalFindings}
                            onChange={(e) => handleInputChange("clinicalFindings", e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Describa los hallazgos encontrados durante el examen físico y evaluación clínica..."
                            rows={4}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                        border-gray-300`}
                        />
                    </div>

                    {/* Diagnóstico Principal */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Diagnóstico Principal *
                        </label>
                        <input
                            type="text"
                            value={diagnostics.primaryDiagnosis}
                            onChange={(e) => handleInputChange("primaryDiagnosis", e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Ej: Hipertensión arterial esencial (I10)"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                        ${errors?.["diagnostics.primaryDiagnosis"] ? "border-red-500" : "border-gray-300"}`}
                        />
                        {errors?.["diagnostics.primaryDiagnosis"] && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors["diagnostics.primaryDiagnosis"]}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Incluya el código CIE-10 si está disponible
                        </p>
                    </div>

                    {/* Diagnóstico Secundario */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            Diagnóstico Secundario
                        </label>
                        <input
                            type="text"
                            value={diagnostics.secondaryDiagnosis || ""}
                            onChange={(e) => handleInputChange("secondaryDiagnosis", e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Diagnóstico secundario o comorbilidades (opcional)"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                        border-gray-300`}
                        />
                    </div>

                    {/* Impresión Diagnóstica */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Stethoscope className="w-4 h-4" />
                            Impresión Diagnóstica y Razonamiento Clínico
                        </label>
                        <textarea
                            value={diagnostics.diagnosticImpression}
                            onChange={(e) => handleInputChange("diagnosticImpression", e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Explique el razonamiento clínico que llevó al diagnóstico, diagnósticos diferenciales considerados, etc..."
                            rows={5}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}
                                        border-gray-300`}
                        />
                    </div>
                </div>
            </div>

            {/* Sección de Documentos */}
            {!isReadOnly && (
                <div className="bg-white rounded-lg border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Upload className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Documentos de Soporte
                                <span className="text-sm font-normal text-gray-500 ml-2">(Opcional)</span>
                            </h3>
                            <p className="text-sm text-gray-500">
                                Adjunte resultados de laboratorio, imágenes, u otros documentos relevantes
                            </p>
                        </div>
                    </div>

                    {/* Zona de Drop para archivos */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
                                   ${dragActive 
                                       ? "border-blue-400 bg-blue-50" 
                                       : "border-gray-300 hover:border-gray-400"}`}
                    >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                            Arrastra archivos aquí o 
                            <label className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
                                selecciona archivos
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                    className="hidden"
                                />
                            </label>
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
                                    Archivos seleccionados:
                                </h4>
                                {documents.some(doc => !doc.uploaded && !doc.uploading) && (
                                    <button
                                        onClick={uploadAllDocuments}
                                        disabled={isUploading}
                                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                                    >
                                        {isUploading ? "Subiendo..." : "Subir Todos"}
                                    </button>
                                )}
                            </div>
                            {documents.map((documentInfo, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">
                                            {getFileIcon(documentInfo.file.type)}
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {documentInfo.file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(documentInfo.file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                            {documentInfo.error && (
                                                <p className="text-xs text-red-600">
                                                    {documentInfo.error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {documentInfo.uploading && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        )}
                                        
                                        {documentInfo.uploaded && (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        )}
                                        
                                        {documentInfo.error && (
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        
                                        {!documentInfo.uploaded && !documentInfo.uploading && (
                                            <button
                                                onClick={() => uploadDocument(index)}
                                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
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
                    )}
                </div>
            )}

            {/* Indicador de campos obligatorios */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-800">
                        Información importante
                    </p>
                </div>
                <ul className="space-y-1 text-xs text-yellow-700">
                    <li>• Los campos marcados con (*) son obligatorios</li>
                    <li>• Los documentos se asociarán automáticamente al diagnóstico</li>
                    <li>• Puede subir documentos durante o después de completar el diagnóstico</li>
                </ul>
            </div>
        </div>
    );
}