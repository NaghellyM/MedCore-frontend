import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../core/utils/cn"

// Variantes del badge

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border",
    "text-xs font-medium",
    "transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-transparent bg-primary text-primary-foreground",
          "hover:bg-primary/90",
        ],
        secondary: [
          "border-transparent bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
        ],
        outline: [
          "border-border bg-transparent text-foreground",
          "hover:bg-muted",
        ],
        // Semánticos - para estados médicos
        success: [
          "border-success/30 bg-success-light text-success",
          "dark:bg-success/20",
        ],
        warning: [
          "border-warning/30 bg-warning-light text-warning",
          "dark:bg-warning/20",
        ],
        destructive: [
          "border-destructive/30 bg-destructive-light text-destructive",
          "dark:bg-destructive/20",
        ],
        info: [
          "border-info/30 bg-info-light text-info",
          "dark:bg-info/20",
        ],
        // Estados específicos médicos
        active: [
          "border-success/30 bg-success-light text-success",
          "dark:bg-success/20",
        ],
        inactive: [
          "border-border bg-muted text-muted-foreground",
        ],
        pending: [
          "border-warning/30 bg-warning-light text-warning",
          "dark:bg-warning/20",
        ],
        critical: [
          "border-destructive/30 bg-destructive-light text-destructive",
          "dark:bg-destructive/20",
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-2.5 py-0.5",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Componente Badge

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  // Icono a la izquierda
  leftIcon?: React.ReactNode
  // Icono a la derecha
  rightIcon?: React.ReactNode
  // Si el badge es removible
  removable?: boolean
  // Callback al remover
  onRemove?: () => void
  // Indicador de punto/dot
  dot?: boolean
  // Color del dot (solo si dot=true)
  dotColor?: "default" | "success" | "warning" | "destructive" | "info"
}

function Badge({
  className,
  variant,
  size,
  leftIcon,
  rightIcon,
  removable,
  onRemove,
  dot,
  dotColor = "default",
  children,
  ...props
}: BadgeProps) {
  const dotColorClasses = {
    default: "bg-current",
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    info: "bg-info",
  }

  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {/* Indicador de punto */}
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColorClasses[dotColor]
          )}
          aria-hidden="true"
        />
      )}

      {/* Icono izquierdo */}
      {leftIcon && (
        <span className="shrink-0 [&>svg]:h-3 [&>svg]:w-3" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Contenido */}
      {children}

      {/* Icono derecho */}
      {rightIcon && (
        <span className="shrink-0 [&>svg]:h-3 [&>svg]:w-3" aria-hidden="true">
          {rightIcon}
        </span>
      )}

      {/* Botón de remover */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className={cn(
            "ml-1 -mr-1 h-4 w-4 shrink-0",
            "rounded-full",
            "inline-flex items-center justify-center",
            "opacity-70 hover:opacity-100",
            "focus:outline-none focus:ring-1 focus:ring-ring",
            "transition-opacity"
          )}
          aria-label="Remover"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

// Grupo de badges - Para agrupar badges relacionados

interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  // Máximo de badges visibles (muestra "+N" si hay más)
  max?: number
}

function BadgeGroup({
  className,
  max,
  children,
  ...props
}: BadgeGroupProps) {
  const childArray = React.Children.toArray(children)
  const visibleChildren = max ? childArray.slice(0, max) : childArray
  const remainingCount = max ? childArray.length - max : 0

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    >
      {visibleChildren}
      {remainingCount > 0 && (
        <Badge variant="outline" size="sm">
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}

export { Badge, BadgeGroup, badgeVariants }
