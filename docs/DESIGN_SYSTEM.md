# Sistema de Diseño MedCore - Guía Completa

## Índice

1. [Resumen del Sistema](#resumen-del-sistema)
2. [Design Tokens](#design-tokens)
3. [Configuración de Temas](#configuración-de-temas)
4. [Componentes UI](#componentes-ui)
5. [Estrategia de Migración](#estrategia-de-migración)
6. [Ejemplos de Código](#ejemplos-de-código)
7. [Mejoras de UX Recomendadas](#mejoras-de-ux-recomendadas)

---

## Resumen del Sistema

Este sistema de diseño está optimizado para aplicaciones médicas/hospitalarias con:

- ✅ **Accesibilidad WCAG 2.1 AA**: Contrastes mínimos, estados de foco visibles, etiquetas ARIA
- ✅ **Temas Claro/Oscuro**: Automático (sistema) o manual
- ✅ **Paleta profesional y calmante**: Azules suaves para confianza, morado para profesionalismo
- ✅ **Componentes semánticos**: Estados de éxito, advertencia, error, info
- ✅ **Responsive y mobile-first**: Funciona en todos los dispositivos

### Paletas de Colores Utilizadas

```
Paleta 1 (Azules suaves - Calma, Confianza):
#8DBCC7 → Secondary (acciones secundarias)
#A4CCD9 → Sidebar accent
#C4E1E6 → Muted/backgrounds suaves
#EBFFD8 → Success light backgrounds

Paleta 2 (Morado + Acentos - Profesionalismo):
#647FBC → Primary (acciones principales, CTAs)
#91ADC8 → Sidebar, elementos de soporte
#AED6CF → Accent (highlights, badges)
#FAFDD6 → Warning light backgrounds
```

---

## Design Tokens

### Colores Semánticos

| Token | Tema Claro | Tema Oscuro | Uso |
|-------|------------|-------------|-----|
| `--primary` | #647FBC | Más brillante | Botones principales, enlaces, CTAs |
| `--secondary` | #8DBCC7 | Ajustado | Botones secundarios, elementos de soporte |
| `--accent` | #AED6CF | Ajustado | Highlights, badges informativos |
| `--success` | #10B981 | Ligeramente más claro | Estados positivos, confirmaciones |
| `--warning` | #F59E0B | Ligeramente más claro | Alertas, precauciones |
| `--destructive` | #EF4444 | Ligeramente más claro | Errores, acciones peligrosas |
| `--info` | #0EA5E9 | Ligeramente más claro | Información, ayuda |

### Tipografía

```css
/* Familias */
--font-sans: 'Inter', 'Saira', system-ui, sans-serif;
--font-display: 'Fjalla One', 'Inter', sans-serif;

/* Tamaños */
--text-xs: 0.75rem;    /* 12px - Notas pequeñas */
--text-sm: 0.875rem;   /* 14px - Labels, texto secundario */
--text-base: 1rem;     /* 16px - Texto de párrafo */
--text-lg: 1.125rem;   /* 18px - Subtítulos pequeños */
--text-xl: 1.25rem;    /* 20px - Subtítulos */
--text-2xl: 1.5rem;    /* 24px - Títulos de sección */
--text-3xl: 1.875rem;  /* 30px - Títulos de página */
--text-4xl: 2.25rem;   /* 36px - Títulos principales */
```

### Espaciado

```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
```

### Bordes y Sombras

```css
/* Border Radius */
--radius-sm: 0.25rem;  /* 4px - Badges */
--radius-md: 0.5rem;   /* 8px - Botones, inputs */
--radius-lg: 0.75rem;  /* 12px - Cards */
--radius-xl: 1rem;     /* 16px - Containers */

/* Sombras */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## Configuración de Temas

### Archivos Modificados

1. **`src/index.css`**: Variables CSS para tema claro (`:root`) y oscuro (`.dark`)
2. **`tailwind.config.js`**: Configuración extendida con colores que leen las variables CSS

### Uso del Theme Toggle

```tsx
import { ThemeToggle, ThemeSwitcher } from '@/presentation/components/ui';

// Toggle simple (solo icono)
<ThemeToggle size="md" />

// Switcher completo con dropdown (Light/Dark/System)
<ThemeSwitcher />
```

### Hook useTheme

```tsx
import { useTheme } from '@/core/hooks/ui/useTheme';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Modo Claro' : 'Modo Oscuro'}
    </button>
  );
}
```

---

## Componentes UI

### Button

```tsx
import { Button } from '@/presentation/components/ui';

// Variantes
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

// Tamaños
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>

// Estados
<Button loading>Cargando...</Button>
<Button loading loadingText="Guardando...">Guardar</Button>
<Button disabled>Deshabilitado</Button>

// Con iconos
<Button leftIcon={<Save />}>Guardar</Button>
<Button rightIcon={<ArrowRight />}>Siguiente</Button>

// Ancho completo
<Button fullWidth>Botón Ancho</Button>
```

### Input

```tsx
import { Input } from '@/presentation/components/ui';

// Básico
<Input placeholder="Nombre" />

// Con label y error
<Input 
  label="Correo Electrónico"
  placeholder="correo@ejemplo.com"
  error
  errorMessage="El correo es requerido"
  required
/>

// Con iconos
<Input 
  leftIcon={<Search />}
  placeholder="Buscar..."
/>

// Variantes
<Input variant="default" />
<Input variant="filled" />

// Tamaños
<Input inputSize="sm" />
<Input inputSize="default" />
<Input inputSize="lg" />
```

### Alert

```tsx
import { Alert } from '@/presentation/components/ui';

// Variantes
<Alert variant="info">Información importante</Alert>
<Alert variant="success">Operación exitosa</Alert>
<Alert variant="warning">Precaución</Alert>
<Alert variant="destructive">Error crítico</Alert>

// Con título y acciones
<Alert 
  variant="warning"
  title="Atención"
  closable
  onClose={() => {}}
  actions={
    <Button size="sm">Ver detalles</Button>
  }
>
  El paciente tiene alergias registradas.
</Alert>
```

### Badge

```tsx
import { Badge } from '@/presentation/components/ui';

// Estados médicos
<Badge variant="active">Activo</Badge>
<Badge variant="pending">Pendiente</Badge>
<Badge variant="critical">Crítico</Badge>
<Badge variant="inactive">Inactivo</Badge>

// Con indicador dot
<Badge dot dotColor="success">En línea</Badge>

// Removible
<Badge removable onRemove={() => {}}>Etiqueta</Badge>
```

### Modal

```tsx
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle,
  ModalBody,
  ModalFooter,
  ConfirmationModal 
} from '@/presentation/components/ui';

// Modal completo
<Modal open={open} onOpenChange={setOpen}>
  <ModalContent size="lg">
    <ModalHeader>
      <ModalTitle>Título del Modal</ModalTitle>
    </ModalHeader>
    <ModalBody>
      Contenido del modal...
    </ModalBody>
    <ModalFooter>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <Button>Confirmar</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// Modal de confirmación rápido
<ConfirmationModal
  open={open}
  onOpenChange={setOpen}
  title="¿Eliminar paciente?"
  description="Esta acción no se puede deshacer."
  confirmText="Eliminar"
  confirmVariant="destructive"
  onConfirm={handleDelete}
  loading={isDeleting}
/>
```

### Spinner & Skeletons

```tsx
import { 
  Spinner, 
  PageLoader, 
  InlineLoader,
  SkeletonCard,
  SkeletonTable,
  SkeletonForm 
} from '@/presentation/components/ui';

// Spinner simple
<Spinner />
<Spinner size="lg" text="Cargando datos..." />

// Loader de página completa
<PageLoader text="Cargando sistema..." />

// Loader inline
<InlineLoader text="Cargando pacientes..." />

// Skeletons para diferentes contextos
<SkeletonCard showImage showFooter />
<SkeletonTable rows={5} columns={4} />
<SkeletonForm fields={4} />
```

---

## Estrategia de Migración

### Fase 1: Fundamentos (Completado ✅)

1. ✅ Crear design tokens en `index.css`
2. ✅ Configurar `tailwind.config.js` con variables CSS
3. ✅ Crear hook `useTheme` y componente `ThemeSwitcher`
4. ✅ Actualizar componente `Button` con nuevas variantes
5. ✅ Actualizar componente `Input` con estados de error y label
6. ✅ Crear componentes `Alert`, `Modal`, `Spinner`, `Badge`

### Fase 2: Autenticación (Siguiente)

**Archivos a migrar:**
- `src/presentation/pages/login/loginDashboard.tsx`
- `src/presentation/components/globals/button.tsx`
- `src/presentation/components/globals/input.tsx`

**Ejemplo de migración del botón de login:**

```tsx
// ❌ ANTES (globals/button.tsx)
const Button: React.FC<ButtonProps> = ({ label, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full bg-blue-500 text-white py-2 rounded-md"
  >
    {label}
  </button>
);

// ✅ DESPUÉS (usar componente del sistema de diseño)
import { Button } from '@/presentation/components/ui';

<Button type="submit" fullWidth size="lg">
  {label}
</Button>
```

**Ejemplo de migración del input:**

```tsx
// ❌ ANTES (globals/input.tsx)
<input 
  {...field} 
  className="mt-1 p-2 w-full border rounded-md"
/>
{error && <p className="text-red-500 text-xs">{error.message}</p>}

// ✅ DESPUÉS
import { Input } from '@/presentation/components/ui';

<Input
  {...field}
  label="Correo Electrónico"
  error={!!errors.email}
  errorMessage={errors.email?.message}
  leftIcon={<Mail size={18} />}
  required
/>
```

### Fase 3: Formularios de Paciente

**Archivos a migrar:**
- `src/presentation/pages/patient/`
- Formularios de registro de paciente
- Formularios de historia clínica

**Acciones:**
1. Reemplazar inputs manuales por `<Input />`
2. Reemplazar textareas por `<Textarea />`
3. Usar `<Alert />` para mensajes de error/éxito
4. Usar `<Badge />` para estados del paciente

### Fase 4: Tablas y Listados

**Archivos a migrar:**
- Listados de pacientes
- Listados de citas
- Tablas de historia clínica

**Acciones:**
1. Usar `<Table />` del sistema de diseño
2. Agregar `<SkeletonTable />` para estados de carga
3. Usar `<Badge />` para estados en filas
4. Usar `<Button variant="ghost" size="icon" />` para acciones

### Fase 5: Layouts y Navegación

**Archivos a migrar:**
- `src/presentation/layouts/`
- Sidebar
- Header/Navbar

**Acciones:**
1. Agregar `<ThemeToggle />` en el header
2. Usar tokens de color del sidebar
3. Aplicar variables de espaciado consistentes

### Fase 6: Páginas Restantes

**Archivos a migrar:**
- Módulos de doctor/enfermera
- Administración
- Reportes y estadísticas

---

## Ejemplos de Código

### Formulario Completo con Nuevo Sistema

```tsx
import { useForm, Controller } from 'react-hook-form';
import { 
  Button, 
  Input, 
  Textarea, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Alert
} from '@/presentation/components/ui';

function PatientForm() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registro de Paciente</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" closable onClose={() => setError(null)} className="mb-6">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Nombre"
                  error={!!errors.firstName}
                  errorMessage={errors.firstName?.message}
                  required
                />
              )}
            />
            
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Apellido"
                  error={!!errors.lastName}
                  errorMessage={errors.lastName?.message}
                  required
                />
              )}
            />
          </div>
          
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Notas Adicionales"
                hint="Información relevante para el tratamiento"
                maxLength={500}
                showCount
              />
            )}
          />
          
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Guardar Paciente
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## Mejoras de UX Recomendadas

### 1. Estados de Carga Consistentes

```tsx
// Usar skeletons en lugar de spinners para tablas/listas
{isLoading ? (
  <SkeletonTable rows={5} columns={4} />
) : (
  <Table>...</Table>
)}
```

### 2. Feedback Visual Inmediato

```tsx
// Botones con estado de loading
<Button 
  loading={isSubmitting}
  loadingText="Guardando cambios..."
>
  Guardar
</Button>
```

### 3. Jerarquía Tipográfica Clara

```tsx
// Títulos de página
<h1 className="text-3xl font-bold text-foreground">Pacientes</h1>

// Subtítulos de sección
<h2 className="text-xl font-semibold text-foreground">Datos Personales</h2>

// Texto secundario
<p className="text-muted-foreground">Última actualización: hace 2 horas</p>
```

### 4. Estados Médicos con Color

```tsx
// Usar badges semánticos
<Badge variant="critical">Crítico</Badge>
<Badge variant="active">Activo</Badge>
<Badge variant="pending">En espera</Badge>

// Alertas para estados importantes
<Alert variant="warning" title="Alergias Registradas">
  El paciente es alérgico a la penicilina
</Alert>
```

### 5. Espaciado Consistente

```tsx
// Usar clases de espaciado del sistema
<div className="space-y-6">      {/* Secciones grandes */}
  <div className="space-y-4">    {/* Grupos de campos */}
    <div className="space-y-2">  {/* Label + Input */}
    </div>
  </div>
</div>
```

### 6. Confirmaciones para Acciones Destructivas

```tsx
<ConfirmationModal
  open={showDeleteConfirm}
  onOpenChange={setShowDeleteConfirm}
  title="¿Eliminar registro?"
  description="Esta acción eliminará permanentemente el registro del paciente. Esta acción no se puede deshacer."
  confirmText="Eliminar"
  confirmVariant="destructive"
  onConfirm={handleDelete}
/>
```

---

## Archivos Creados/Modificados

### Nuevos Archivos:
- `src/core/hooks/ui/useTheme.ts`
- `src/presentation/components/ui/theme-switcher.tsx`
- `src/presentation/components/ui/textarea.tsx`
- `src/presentation/components/ui/alert.tsx`
- `src/presentation/components/ui/modal.tsx`
- `src/presentation/components/ui/spinner.tsx`
- `src/presentation/components/ui/index.ts`
- `src/presentation/pages/login/LoginPageExample.tsx`
- `docs/DESIGN_SYSTEM.md` (este archivo)

### Archivos Modificados:
- `src/index.css` - Variables CSS completas
- `tailwind.config.js` - Configuración extendida
- `src/presentation/components/ui/button.tsx` - Nuevas variantes
- `src/presentation/components/ui/input.tsx` - Estados y labels
- `src/presentation/components/ui/badge.tsx` - Variantes semánticas

---

## Siguiente Paso Recomendado

1. **Probar el ejemplo de Login**: Navega a `LoginPageExample.tsx` y verifica que todo funciona
2. **Migrar el Login real**: Reemplaza el contenido de `loginDashboard.tsx` con el nuevo código
3. **Agregar ThemeToggle al Header**: En el layout principal de la app
4. **Migrar componentes globales**: Actualizar `globals/button.tsx` y `globals/input.tsx` para usar los nuevos componentes

¿Necesitas ayuda con algún paso específico de la migración?
