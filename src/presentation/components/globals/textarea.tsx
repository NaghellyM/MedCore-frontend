import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../core/utils/cn";

// Variantes del textarea

const textareaVariants = cva(
  [
    "flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2",
    "text-sm text-foreground placeholder:text-muted-foreground",
    "transition-all duration-200 resize-y",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
  ],
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/50",
        filled: "border-transparent bg-muted hover:bg-muted/80",
      },
      error: {
        true: "border-destructive focus-visible:ring-destructive/50 hover:border-destructive",
        false: "",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      error: false,
      resize: "vertical",
    },
  }
)

// Componente Textarea

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  // Mensaje de error
  errorMessage?: string
  // Texto de ayuda
  hint?: string
  // Mostrar contador de caracteres
  showCount?: boolean
  // Label del campo
  label?: string
  // Si es requerido
  required?: boolean
  // Clases del wrapper
  wrapperClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      error,
      resize,
      errorMessage,
      hint,
      showCount,
      maxLength,
      label,
      required,
      id: providedId,
      wrapperClassName,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const textareaId = providedId || generatedId
    const errorId = `${textareaId}-error`
    const hintId = `${textareaId}-hint`

    // Estado interno para el contador
    const [charCount, setCharCount] = React.useState(
      () => String(value || defaultValue || '').length
    )

    // Manejar cambios para actualizar contador
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    const showError = error && errorMessage
    const showHint = hint && !showError

    const textareaElement = (
      <textarea
        id={textareaId}
        ref={ref}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={error || undefined}
        aria-describedby={cn(
          showError && errorId,
          showHint && hintId
        ) || undefined}
        aria-required={required}
        className={cn(textareaVariants({ variant, error, resize }), className)}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        {...props}
      />
    )

    // Input simple sin decoraciones
    if (!label && !showError && !showHint && !showCount) {
      return textareaElement
    }

    return (
      <div className={cn("space-y-2", wrapperClassName)}>
        {/* Etiqueta */}
        {label && (
          <label
            htmlFor={textareaId}
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

        {/* Textarea */}
        {textareaElement}

        {/* Pie: error/ayuda + contador */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
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

          {/* Contador de caracteres */}
          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs tabular-nums",
                charCount > maxLength * 0.9
                  ? "text-warning"
                  : "text-muted-foreground",
                charCount >= maxLength && "text-destructive"
              )}
              aria-live="polite"
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
