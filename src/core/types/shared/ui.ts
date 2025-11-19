/**
 * TIPOS COMPARTIDOS - UI
 * ======================
 * Este archivo contiene interfaces comunes para componentes de UI
 */

// Props base para componentes
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// Estados de carga
export interface LoadingState {
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string;
}

// Estados de formulario
export interface FormState {
    isDirty: boolean;
    isSubmitting: boolean;
    isValid: boolean;
    errors: Record<string, string>;
}

// Configuración de tabla
export interface TableColumn<T = any> {
    key: keyof T | string;
    title: string;
    width?: string;
    sortable?: boolean;
    render?: (value: any, record: T, index: number) => React.ReactNode;
}

// Props de modal
export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'small' | 'medium' | 'large' | 'xl';
}

// Props de botón
export interface ButtonProps extends BaseComponentProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

// Error de validación
export interface ValidationError {
    field: string;
    message: string;
    section?: string;
}

// Resultado de validación
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}