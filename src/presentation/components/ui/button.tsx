import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "../../../core/utils/cn";

// Variantes del botón - Usando class-variance-authority

const buttonVariants = cva(
  // Estilos base aplicados a todas las variantes
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-md text-sm font-medium",
    "transition-all duration-200 ease-in-out",
    // Estilos de foco - accesibilidad
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // Estilos deshabilitado
    "disabled:pointer-events-none disabled:opacity-50",
    // Estado activo
    "active:scale-[0.98]",
    // Hijos SVG
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary text-primary-foreground",
          "hover:bg-primary-hover hover:shadow-button-hover",
          "shadow-button",
        ],
        secondary: [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary-hover hover:shadow-button-hover",
          "shadow-button",
        ],
        outline: [
          "border-2 border-primary bg-transparent text-primary",
          "hover:bg-primary hover:text-primary-foreground",
        ],
        ghost: [
          "bg-transparent text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
        ],
        link: [
          "bg-transparent text-primary underline-offset-4",
          "hover:underline",
          "h-auto p-0",
        ],
        destructive: [
          "bg-destructive text-destructive-foreground",
          "hover:bg-destructive/90 hover:shadow-button-hover",
          "shadow-button",
        ],
        success: [
          "bg-success text-success-foreground",
          "hover:bg-success/90 hover:shadow-button-hover",
          "shadow-button",
        ],
        warning: [
          "bg-warning text-warning-foreground",
          "hover:bg-warning/90 hover:shadow-button-hover",
          "shadow-button",
        ],
        // Variante especial para botones suaves (fondo claro)
        "soft-primary": [
          "bg-primary/10 text-primary",
          "hover:bg-primary/20",
        ],
        "soft-destructive": [
          "bg-destructive/10 text-destructive",
          "hover:bg-destructive/20",
        ],
        "soft-success": [
          "bg-success/10 text-success",
          "hover:bg-success/20",
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs [&_svg]:size-3.5",
        default: "h-10 px-4 py-2 [&_svg]:size-4",
        lg: "h-11 px-6 text-base [&_svg]:size-5",
        xl: "h-12 px-8 text-base [&_svg]:size-5",
        icon: "h-10 w-10 p-0 [&_svg]:size-5",
        "icon-sm": "h-8 w-8 p-0 [&_svg]:size-4",
        "icon-lg": "h-12 w-12 p-0 [&_svg]:size-6",
      },
      // Ancho completo
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

// Componente Botón

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Renderizar como otro elemento (para uso con React Router Link, etc.)
  asChild?: boolean
  // Estado de carga - muestra spinner y deshabilita el botón
  loading?: boolean
  // Texto alternativo durante loading
  loadingText?: string
  // Icono a mostrar antes del texto
  leftIcon?: React.ReactNode
  // Icono a mostrar después del texto
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // Si asChild, no modificamos el contenido
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          {...props}
        />
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {/* Spinner de carga */}
        {loading && (
          <Loader2 
            className="animate-spin" 
            aria-hidden="true"
          />
        )}
        
        {/* Icono izquierdo (no mostrar si está cargando) */}
        {!loading && leftIcon && (
          <span className="shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        
        {/* Contenido principal */}
        {loading && loadingText ? loadingText : children}
        
        {/* Icono derecho */}
        {rightIcon && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Grupo de botones - Para agrupar botones relacionados

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  // Orientación del grupo
  orientation?: 'horizontal' | 'vertical'
  // Espacio entre botones
  spacing?: 'none' | 'sm' | 'md'
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', spacing = 'sm', children, ...props }, ref) => {
    const spacingClasses = {
      none: '',
      sm: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
      md: orientation === 'horizontal' ? 'gap-4' : 'gap-3',
    }

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
          spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { Button, ButtonGroup, buttonVariants }
