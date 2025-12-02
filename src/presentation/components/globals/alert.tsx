import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react"

import { cn } from "../../../core/utils/cn"

// Variantes del componente Alert

const alertVariants = cva(
  [
    "relative w-full rounded-lg border p-4",
    "flex gap-3",
    "[&>svg]:shrink-0 [&>svg]:mt-0.5",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-background text-foreground border-border",
          "[&>svg]:text-foreground",
        ],
        info: [
          "bg-info-light text-info border-info/30",
          "[&>svg]:text-info",
        ],
        success: [
          "bg-success-light text-success border-success/30",
          "[&>svg]:text-success",
        ],
        warning: [
          "bg-warning-light text-warning border-warning/30",
          "[&>svg]:text-warning",
        ],
        destructive: [
          "bg-destructive-light text-destructive border-destructive/30",
          "[&>svg]:text-destructive",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Iconos del Alert

const alertIcons = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  destructive: AlertCircle,
}

// Componente Alert

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  // Título del alert
  title?: string
  // Si se puede cerrar
  closable?: boolean
  // Callback al cerrar
  onClose?: () => void
  // Icono personalizado
  icon?: React.ReactNode
  // Ocultar icono
  hideIcon?: boolean
  // Acciones adicionales (botones, enlaces)
  actions?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      closable,
      onClose,
      icon,
      hideIcon = false,
      actions,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleClose = () => {
      setIsVisible(false)
      onClose?.()
    }

    if (!isVisible) return null

    // Obtener el icono apropiado
    const IconComponent = alertIcons[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {/* Icono */}
        {!hideIcon && (
          icon || <IconComponent className="h-5 w-5" aria-hidden="true" />
        )}

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {title && (
            <AlertTitle>{title}</AlertTitle>
          )}
          {children && (
            <AlertDescription>{children}</AlertDescription>
          )}
          {actions && (
            <div className="mt-3 flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>

        {/* Botón cerrar */}
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              "absolute top-3 right-3",
              "rounded-md p-1",
              "opacity-70 hover:opacity-100",
              "transition-opacity",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label="Cerrar alerta"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
)
Alert.displayName = "Alert"

// Título del Alert

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-tight tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

// Descripción del Alert

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 mt-1 [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription, alertVariants }
