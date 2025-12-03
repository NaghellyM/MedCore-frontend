import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../core/utils/cn"

// Modal raíz y disparador

const Modal = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger
const ModalClose = DialogPrimitive.Close
const ModalPortal = DialogPrimitive.Portal

// Overlay del modal

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-modal-backdrop",
      "bg-black/50 backdrop-blur-sm",
      // Animaciones
      "data-[state=open]:animate-fade-in",
      "data-[state=closed]:animate-fade-out",
      className
    )}
    {...props}
  />
))
ModalOverlay.displayName = "ModalOverlay"

// Variantes del contenido del modal

const modalContentVariants = cva(
  [
    "fixed z-modal",
    "w-full bg-background shadow-xl",
    "border border-border rounded-lg",
    // Animaciones
    "data-[state=open]:animate-scale-in",
    "data-[state=closed]:animate-fade-out",
    // Gestión del foco
    "focus:outline-none",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
      },
      position: {
        center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        top: "left-1/2 top-16 -translate-x-1/2",
      },
    },
    defaultVariants: {
      size: "default",
      position: "center",
    },
  }
)

// Contenido del modal

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {
  // Mostrar botón de cerrar
  showCloseButton?: boolean
  // Overlay personalizado
  overlayClassName?: string
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      size,
      position,
      showCloseButton = true,
      overlayClassName,
      ...props
    },
    ref
  ) => (
    <ModalPortal>
      <ModalOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(modalContentVariants({ size, position }), className)}
        {...props}
      >
        {children}

        {/* Botón de cerrar */}
        {showCloseButton && (
          <DialogPrimitive.Close
            className={cn(
              "absolute top-4 right-4",
              "rounded-md p-1.5",
              "text-muted-foreground hover:text-foreground",
              "opacity-70 hover:opacity-100",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:pointer-events-none"
            )}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </ModalPortal>
  )
)
ModalContent.displayName = "ModalContent"

// Encabezado del modal

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 pb-4",
      "border-b border-border",
      className
    )}
    {...props}
  />
)
ModalHeader.displayName = "ModalHeader"

// Título del modal

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
ModalTitle.displayName = "ModalTitle"

// Descripción del modal

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
ModalDescription.displayName = "ModalDescription"

// Cuerpo del modal

const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("p-6", className)}
    {...props}
  />
)
ModalBody.displayName = "ModalBody"

// Pie del modal

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 p-6 pt-4",
      "border-t border-border",
      className
    )}
    {...props}
  />
)
ModalFooter.displayName = "ModalFooter"

// Modal de confirmación - Componente de conveniencia

export interface ConfirmationModalProps {
  // Si el modal está abierto
  open: boolean
  // Callback para cambiar estado
  onOpenChange: (open: boolean) => void
  // Título
  title: string
  // Descripción/mensaje
  description: string
  // Texto del botón de confirmar
  confirmText?: string
  // Texto del botón de cancelar
  cancelText?: string
  // Variante del botón de confirmar
  confirmVariant?: "default" | "destructive"
  // Callback al confirmar
  onConfirm: () => void | Promise<void>
  // Si está cargando
  loading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "default",
  onConfirm,
  loading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm" showCloseButton={false}>
        <ModalHeader className="border-b-0 pb-2">
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody className="pt-2">
          <p className="text-sm text-muted-foreground">{description}</p>
        </ModalBody>
        <ModalFooter className="border-t-0 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-4 py-2",
              "text-sm font-medium",
              "bg-secondary text-secondary-foreground",
              "hover:bg-secondary-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:pointer-events-none",
              "transition-colors"
            )}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2",
              "text-sm font-medium",
              confirmVariant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary-hover",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:pointer-events-none",
              "transition-colors"
            )}
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
ConfirmationModal.displayName = "ConfirmationModal"

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ConfirmationModal,
  modalContentVariants,
}
