import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../core/utils/cn";

// Variantes del input

const inputVariants = cva(
  // Estilos base
  [
    "flex w-full rounded-md border bg-background px-3 py-2",
    "text-sm text-foreground placeholder:text-muted-foreground",
    "transition-all duration-200",
    // Estilos de foco
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // Deshabilitado
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
    // Input de archivo
    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  ],
  {
    variants: {
      // Variantes de estilo
      variant: {
        default: "border-input hover:border-primary/50",
        filled: "border-transparent bg-muted hover:bg-muted/80",
        ghost: "border-transparent hover:bg-muted",
      },
      // Tamaños
      inputSize: {
        sm: "h-8 text-xs px-2.5",
        default: "h-10",
        lg: "h-12 text-base px-4",
      },
      // Estado de error
      error: {
        true: [
          "border-destructive",
          "focus-visible:ring-destructive/50",
          "hover:border-destructive",
        ],
        false: "",
      },
      // Estado de éxito (validación pasada)
      success: {
        true: [
          "border-success",
          "focus-visible:ring-success/50",
          "hover:border-success",
        ],
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      error: false,
      success: false,
    },
  }
)

// Componente Input

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  // Mensaje de error a mostrar
  errorMessage?: string
  // Texto de ayuda
  hint?: string
  // Icono a la izquierda
  leftIcon?: React.ReactNode
  // Icono a la derecha
  rightIcon?: React.ReactNode
  // Elemento a la derecha (botón, etc.)
  rightElement?: React.ReactNode
  // Label del campo
  label?: string
  // Si el campo es requerido
  required?: boolean
  // ID personalizado (se genera uno si no se proporciona)
  id?: string
  // Contenedor con estilos de form-field
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant,
      inputSize,
      error,
      success,
      errorMessage,
      hint,
      leftIcon,
      rightIcon,
      rightElement,
      label,
      required,
      id: providedId,
      wrapperClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    // Generar ID único si no se proporciona
    const generatedId = React.useId()
    const inputId = providedId || generatedId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    // Determinar si hay contenido adicional
    const hasLeftIcon = !!leftIcon
    const hasRightContent = !!rightIcon || !!rightElement
    const showError = error && errorMessage
    const showHint = hint && !showError

    // Renderizar input con contenedor si tiene iconos
    const inputElement = (
      <input
        type={type}
        id={inputId}
        ref={ref}
        disabled={disabled}
        aria-invalid={error || undefined}
        aria-describedby={cn(
          showError && errorId,
          showHint && hintId
        ) || undefined}
        aria-required={required}
        className={cn(
          inputVariants({ variant, inputSize, error, success }),
          hasLeftIcon && "pl-10",
          hasRightContent && "pr-10",
          className
        )}
        {...props}
      />
    )

    // Si no hay label ni iconos, retornar input simple
    if (!label && !hasLeftIcon && !hasRightContent && !showError && !showHint) {
      return inputElement
    }

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {/* Etiqueta */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-foreground",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input con iconos */}
        {(hasLeftIcon || hasRightContent) ? (
          <div className="relative">
            {/* Icono izquierdo */}
            {hasLeftIcon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                {leftIcon}
              </div>
            )}

            {inputElement}

            {/* Icono/elemento derecho */}
            {hasRightContent && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {rightElement || (
                  <span className="text-muted-foreground">{rightIcon}</span>
                )}
              </div>
            )}
          </div>
        ) : (
          inputElement
        )}

        {/* Mensaje de error */}
        {showError && (
          <p
            id={errorId}
            className="text-sm text-destructive flex items-center gap-1"
            role="alert"
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {errorMessage}
          </p>
        )}

        {/* Texto de ayuda */}
        {showHint && (
          <p id={hintId} className="text-sm text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// Grupo de inputs - Para inputs con addons

interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-stretch", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
InputGroup.displayName = "InputGroup"

// Addon de input - Para elementos al lado del input

interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'left' | 'right'
}

const InputAddon = React.forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, position = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center px-3 text-sm text-muted-foreground",
          "bg-muted border border-input",
          position === 'left' 
            ? "border-r-0 rounded-l-md" 
            : "border-l-0 rounded-r-md",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
InputAddon.displayName = "InputAddon"

export { Input, InputGroup, InputAddon, inputVariants }
