import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../core/utils/cn"

// Variantes del spinner

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      color: {
        default: "text-primary",
        muted: "text-muted-foreground",
        white: "text-white",
        current: "text-current",
      },
    },
    defaultVariants: {
      size: "default",
      color: "default",
    },
  }
)

// Componente Spinner

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof spinnerVariants> {
  // Texto de carga
  text?: string
  // Posición del texto
  textPosition?: "right" | "bottom"
  // Label para accesibilidad
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size,
      color,
      text,
      textPosition = "right",
      label = "Cargando",
      ...props
    },
    ref
  ) => {
    const spinnerElement = (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn(spinnerVariants({ size, color }), className)}
        {...props}
      />
    )

    if (!text) {
      return (
        <>
          {spinnerElement}
          <span className="sr-only">{label}</span>
        </>
      )
    }

    return (
      <div
        className={cn(
          "flex items-center gap-3",
          textPosition === "bottom" && "flex-col gap-2"
        )}
      >
        {spinnerElement}
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

// Cargador de página completa

export interface PageLoaderProps {
  // Texto a mostrar
  text?: string
  // Logo/imagen personalizada
  logo?: React.ReactNode
}

const PageLoader: React.FC<PageLoaderProps> = ({
  text = "Cargando...",
  logo,
}) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
    {logo && <div className="mb-6">{logo}</div>}
    <Spinner size="xl" />
    {text && (
      <p className="mt-4 text-muted-foreground animate-pulse-soft">{text}</p>
    )}
  </div>
)
PageLoader.displayName = "PageLoader"

// Cargador en línea - Para dentro de contenedores

export interface InlineLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  size?: "sm" | "default" | "lg"
}

const InlineLoader = React.forwardRef<HTMLDivElement, InlineLoaderProps>(
  ({ className, text = "Cargando...", size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "py-4",
      default: "py-8",
      lg: "py-12",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <Spinner size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"} />
        {text && (
          <p className="mt-3 text-sm text-muted-foreground">{text}</p>
        )}
      </div>
    )
  }
)
InlineLoader.displayName = "InlineLoader"

// Componentes Skeleton - Para estados de carga

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

// Skeleton para texto
const SkeletonText: React.FC<{
  lines?: number
  className?: string
}> = ({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-4",
          i === lines - 1 ? "w-3/4" : "w-full"
        )}
      />
    ))}
  </div>
)
SkeletonText.displayName = "SkeletonText"

// Skeleton para cards
const SkeletonCard: React.FC<{
  className?: string
  showImage?: boolean
  showFooter?: boolean
}> = ({ className, showImage = false, showFooter = false }) => (
  <div
    className={cn(
      "rounded-lg border border-border bg-card p-4 space-y-4",
      className
    )}
  >
    {showImage && <Skeleton className="h-40 w-full rounded-md" />}
    <div className="space-y-2">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    {showFooter && (
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    )}
  </div>
)
SkeletonCard.displayName = "SkeletonCard"

// Skeleton para tablas
const SkeletonTable: React.FC<{
  rows?: number
  columns?: number
  className?: string
}> = ({ rows = 5, columns = 4, className }) => (
  <div className={cn("space-y-3", className)}>
    {/* Encabezado */}
    <div className="flex gap-4 pb-2 border-b border-border">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`h-${i}`} className="h-4 flex-1" />
      ))}
    </div>
    {/* Filas */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`r-${rowIndex}`} className="flex gap-4 py-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={`c-${rowIndex}-${colIndex}`}
            className="h-4 flex-1"
          />
        ))}
      </div>
    ))}
  </div>
)
SkeletonTable.displayName = "SkeletonTable"

// Skeleton para avatar + texto
const SkeletonAvatar: React.FC<{
  size?: "sm" | "default" | "lg"
  showText?: boolean
  className?: string
}> = ({ size = "default", showText = true, className }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className={cn("rounded-full", sizeClasses[size])} />
      {showText && (
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      )}
    </div>
  )
}
SkeletonAvatar.displayName = "SkeletonAvatar"

// Skeleton para formularios
const SkeletonForm: React.FC<{
  fields?: number
  className?: string
}> = ({ fields = 4, className }) => (
  <div className={cn("space-y-6", className)}>
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))}
    <div className="flex gap-3 pt-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
)
SkeletonForm.displayName = "SkeletonForm"

export {
  Spinner,
  spinnerVariants,
  PageLoader,
  InlineLoader,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar,
  SkeletonForm,
}
