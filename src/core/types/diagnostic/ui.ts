/**
 * TIPOS DE UI - DIAGNÓSTICOS
 * Tipos específicos para componentes de interfaz de usuario
 */

import type { Diagnostic, DiagnosticSummary, DiagnosticState } from './entities';
import type { DiagnosticFormData } from './forms';

// Configuración de tabla de diagnósticos
export interface DiagnosticTableColumn {
    key: keyof DiagnosticSummary | 'actions';
    label: string;
    sortable?: boolean;
    width?: string;
    align?: 'left' | 'center' | 'right';
    render?: (item: DiagnosticSummary) => React.ReactNode;
}

// Props de tabla de diagnósticos
export interface DiagnosticTableProps {
    diagnostics: DiagnosticSummary[];
    columns?: DiagnosticTableColumn[];
    loading?: boolean;
    onEdit?: (diagnostic: DiagnosticSummary) => void;
    onDelete?: (diagnostic: DiagnosticSummary) => void;
    onView?: (diagnostic: DiagnosticSummary) => void;
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    emptyMessage?: string;
    className?: string;
}

// Props de tarjeta de diagnóstico
export interface DiagnosticCardProps {
    diagnostic: DiagnosticSummary;
    onEdit?: (diagnostic: DiagnosticSummary) => void;
    onDelete?: (diagnostic: DiagnosticSummary) => void;
    onView?: (diagnostic: DiagnosticSummary) => void;
    showActions?: boolean;
    compact?: boolean;
    className?: string;
}

// Props de vista detallada
export interface DiagnosticDetailProps {
    diagnostic: Diagnostic;
    onEdit?: () => void;
    onDelete?: () => void;
    onBack?: () => void;
    showActions?: boolean;
    className?: string;
}

// Props de modal de diagnóstico
export interface DiagnosticModalProps {
    isOpen: boolean;
    onClose: () => void;
    diagnostic?: Diagnostic;
    mode: 'create' | 'edit' | 'view';
    patientId: string;
    medicalHistoryId?: string;
    onSave?: (data: DiagnosticFormData) => void | Promise<void>;
    onDelete?: (diagnosticId: string) => void | Promise<void>;
}

// Props de filtros de diagnósticos
export interface DiagnosticFiltersProps {
    onFiltersChange: (filters: DiagnosticFilters) => void;
    currentFilters: DiagnosticFilters;
    onReset: () => void;
    doctors?: Array<{ id: string; fullname: string }>;
    loading?: boolean;
    className?: string;
}

// Configuración de acciones de diagnóstico
export interface DiagnosticAction {
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (diagnostic: DiagnosticSummary) => void;
    disabled?: (diagnostic: DiagnosticSummary) => boolean;
    hidden?: (diagnostic: DiagnosticSummary) => boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
}

// Props de menú de acciones
export interface DiagnosticActionsProps {
    diagnostic: DiagnosticSummary;
    actions: DiagnosticAction[];
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

// Estados de carga
export interface DiagnosticLoadingStates {
    list: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    detail: boolean;
}

// Configuración de paginación
export interface DiagnosticPaginationConfig {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    pageSizeOptions?: number[];
}

// Props de paginación
export interface DiagnosticPaginationProps extends DiagnosticPaginationConfig {
    onChange: (page: number, pageSize: number) => void;
    className?: string;
}

// Configuración de búsqueda
export interface DiagnosticSearchConfig {
    placeholder?: string;
    debounceMs?: number;
    minLength?: number;
    showFilters?: boolean;
    showSort?: boolean;
}

// Props de barra de búsqueda
export interface DiagnosticSearchProps extends DiagnosticSearchConfig {
    value: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
    loading?: boolean;
    className?: string;
}

// Configuración de vista de lista
export interface DiagnosticListConfig {
    viewMode: 'table' | 'cards' | 'list';
    itemsPerPage: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    showFilters: boolean;
    showSearch: boolean;
    showPagination: boolean;
}

// Props principales de la vista de diagnósticos
export interface DiagnosticViewProps {
    patientId?: string;
    medicalHistoryId?: string;
    initialFilters?: Partial<DiagnosticFilters>;
    config?: Partial<DiagnosticListConfig>;
    onDiagnosticSelect?: (diagnostic: Diagnostic) => void;
    readOnly?: boolean;
    className?: string;
}

// Tipos para filtros avanzados
export interface DiagnosticFilters {
    state?: DiagnosticState;
    doctorId?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
}