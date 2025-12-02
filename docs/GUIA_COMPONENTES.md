# Guía de Componentes - MedCore/Cuidarte

Esta guía establece las pautas para crear nuevos componentes que se adapten correctamente al sistema de diseño con soporte para tema claro y oscuro.

---

## 1. Variables CSS del Sistema

**Nunca uses colores hardcodeados.** Usa las variables del sistema de diseño.

```tsx
// ❌ INCORRECTO - Colores hardcodeados
className="bg-blue-500 text-white border-gray-300"

// ✅ CORRECTO - Variables del sistema
className="bg-primary text-primary-foreground border-border"
```

### Variables Disponibles

| Variable | Uso |
|----------|-----|
| `background` / `foreground` | Fondo y texto principal de la página |
| `card` / `card-foreground` | Tarjetas y contenedores |
| `primary` / `primary-foreground` | Acciones principales (botones, enlaces) |
| `secondary` / `secondary-foreground` | Acciones secundarias |
| `muted` / `muted-foreground` | Texto sutil, placeholders, áreas deshabilitadas |
| `accent` / `accent-foreground` | Elementos destacados, hover states |
| `destructive` / `destructive-foreground` | Errores, eliminaciones, alertas críticas |
| `border` | Bordes de elementos |
| `input` | Campos de formulario |
| `ring` | Focus rings para accesibilidad |

---

## 2. Importación de Componentes

### Componentes UI Base

```tsx
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Badge } from "@/presentation/components/ui/badge";
```

### Componentes Globales

```tsx
import { Alert } from "@/presentation/components/globals/alert";
import { Modal } from "@/presentation/components/globals/modal";
import { Spinner } from "@/presentation/components/globals/spinner";
import { Textarea } from "@/presentation/components/globals/textarea";
import { ThemeToggle } from "@/presentation/components/globals/theme-switcher";
```

### Cards de shadcn

```tsx
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle,
    CardDescription,
    CardFooter 
} from "@/presentation/components/ui/card";
```

---

## 3. Componente Button

### Variantes

```tsx
<Button variant="default">Principal</Button>      // Fondo primary
<Button variant="secondary">Secundario</Button>   // Fondo secondary
<Button variant="outline">Contorno</Button>       // Solo borde
<Button variant="ghost">Fantasma</Button>         // Sin fondo, hover sutil
<Button variant="link">Enlace</Button>            // Estilo de enlace
<Button variant="destructive">Eliminar</Button>   // Acción destructiva
```

### Tamaños

```tsx
<Button size="sm">Pequeño</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
<Button size="icon">🔍</Button>  // Solo ícono, cuadrado
```

### Props Adicionales

```tsx
// Ancho completo
<Button fullWidth>Ancho completo</Button>

// Con ícono a la izquierda
<Button leftIcon={<ArrowLeft size={18} />}>Regresar</Button>

// Con ícono a la derecha
<Button rightIcon={<ArrowRight size={18} />}>Siguiente</Button>

// Estado de carga
<Button isLoading>Guardando...</Button>

// Deshabilitado
<Button disabled>No disponible</Button>
```

### Ejemplo Completo

```tsx
import { Button } from "@/presentation/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

const MiFormulario = () => {
    return (
        <div className="flex gap-4">
            <Button 
                variant="outline" 
                leftIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(-1)}
            >
                Regresar
            </Button>
            
            <Button 
                variant="default"
                rightIcon={<Save size={18} />}
                isLoading={isSubmitting}
            >
                Guardar
            </Button>
        </div>
    );
};
```

---

## 4. Componente Input

```tsx
import { Input } from "@/presentation/components/ui/input";

// Input básico
<Input 
    type="text"
    placeholder="Escribe aquí..."
/>

// Con error
<Input 
    type="email"
    placeholder="correo@ejemplo.com"
    error="El correo no es válido"
/>

// Con label (usando estructura de formulario)
<div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
        Correo electrónico
    </label>
    <Input 
        type="email"
        placeholder="correo@ejemplo.com"
    />
</div>
```

---

## 5. Componente Alert

```tsx
import { Alert } from "@/presentation/components/globals/alert";

// Variantes
<Alert variant="default" title="Información">
    Mensaje informativo
</Alert>

<Alert variant="success" title="Éxito">
    Operación completada correctamente
</Alert>

<Alert variant="warning" title="Advertencia">
    Revisa los datos antes de continuar
</Alert>

<Alert variant="error" title="Error">
    No se pudo completar la operación
</Alert>
```

---

## 6. Componente Modal

```tsx
import { Modal } from "@/presentation/components/globals/modal";

const [isOpen, setIsOpen] = useState(false);

<Modal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    title="Confirmar acción"
    description="¿Estás seguro de que deseas continuar?"
>
    <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
        </Button>
        <Button variant="destructive" onClick={handleConfirm}>
            Eliminar
        </Button>
    </div>
</Modal>
```

---

## 7. Componente Spinner

```tsx
import { Spinner } from "@/presentation/components/globals/spinner";

// Tamaños
<Spinner size="sm" />    // Pequeño
<Spinner size="md" />    // Mediano (default)
<Spinner size="lg" />    // Grande

// Colores
<Spinner color="primary" />      // Color primary
<Spinner color="secondary" />    // Color secondary
<Spinner color="muted" />        // Color muted
```

---

## 8. Estructura de Página Estándar

```tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { ThemeToggle } from "@/presentation/components/globals/theme-switcher";

const MiPagina = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Toggle de tema en esquina superior derecha */}
            <div className="fixed top-4 right-4 z-10">
                <ThemeToggle size="sm" />
            </div>

            {/* Contenido centrado */}
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Título de la Página
                        </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Contenido principal */}
                        <p className="text-muted-foreground text-center">
                            Descripción o contenido secundario
                        </p>

                        {/* Acciones */}
                        <div className="space-y-3">
                            <Button fullWidth>
                                Acción Principal
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                fullWidth
                                leftIcon={<ArrowLeft size={18} />}
                                onClick={() => navigate(-1)}
                            >
                                Regresar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MiPagina;
```

---

## 9. Clases de Texto

```tsx
// Texto principal (visible en ambos temas)
<h1 className="text-foreground">Título principal</h1>
<p className="text-foreground">Texto de párrafo</p>

// Texto secundario/sutil
<p className="text-muted-foreground">Texto secundario, descripciones</p>
<span className="text-muted-foreground text-sm">Nota al pie</span>

// Texto sobre fondos con color
<span className="bg-primary text-primary-foreground">Badge primary</span>
<span className="bg-secondary text-secondary-foreground">Badge secondary</span>
<span className="bg-destructive text-destructive-foreground">Error</span>
```

---

## 10. Bordes y Fondos

```tsx
// Bordes estándar
<div className="border border-border rounded-lg">
    Contenido con borde
</div>

// Fondos según contexto
<div className="bg-background">Fondo de página</div>
<div className="bg-card">Fondo de tarjeta</div>
<div className="bg-muted">Área sutil/deshabilitada</div>
<div className="bg-accent">Área destacada</div>

// Combinación común para contenedores
<div className="bg-card border border-border rounded-lg p-4">
    Contenedor estilizado
</div>
```

---

## 11. Estados de Focus e Interacción

```tsx
// Focus ring para accesibilidad
<input className="focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />

// Hover states
<button className="hover:bg-accent hover:text-accent-foreground transition-colors">
    Botón con hover
</button>

// Disabled state
<button className="disabled:opacity-50 disabled:cursor-not-allowed">
    Botón deshabilitado
</button>
```

---

## 12. Hook useTheme

Usa este hook cuando necesites lógica condicional basada en el tema actual.

```tsx
import { useTheme } from "@/core/hooks/ui/useTheme";

const MiComponente = () => {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <div>
            <p>Tema actual: {theme}</p>
            <p>{isDark ? "Modo oscuro activo" : "Modo claro activo"}</p>
            
            <button onClick={toggleTheme}>
                Cambiar tema
            </button>
        </div>
    );
};
```

### Propiedades del Hook

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `theme` | `'light' \| 'dark' \| 'system'` | Tema actual seleccionado |
| `toggleTheme` | `() => void` | Alterna entre light y dark |
| `setTheme` | `(theme) => void` | Establece un tema específico |
| `isDark` | `boolean` | `true` si el tema efectivo es oscuro |

---

## 13. Íconos con Lucide React

```tsx
import { 
    ArrowLeft, 
    ArrowRight, 
    Check, 
    X, 
    Plus,
    Trash2,
    Edit,
    Save,
    Search,
    Settings,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sun,
    Moon
} from "lucide-react";

// Uso básico
<ArrowLeft size={18} />
<Check size={20} className="text-green-500" />

// En botones
<Button leftIcon={<Save size={18} />}>Guardar</Button>

// Íconos que respetan el tema
<Mail size={20} className="text-muted-foreground" />
```

---

## 14. Checklist para Nuevos Componentes

Antes de considerar un componente como terminado, verifica:

- [ ] ¿Usa `bg-background` y `text-foreground` como base?
- [ ] ¿Los botones usan el componente `Button` con variantes apropiadas?
- [ ] ¿Los inputs usan el componente `Input`?
- [ ] ¿No hay colores hardcodeados como `text-gray-700`, `bg-blue-500`, etc.?
- [ ] ¿Las tarjetas usan `Card` de shadcn?
- [ ] ¿Incluye `ThemeToggle` si es una página independiente?
- [ ] ¿El texto secundario usa `text-muted-foreground`?
- [ ] ¿Los bordes usan `border-border`?
- [ ] ¿Los estados de hover/focus usan variables del sistema?
- [ ] ¿El componente se ve bien en tema claro Y oscuro?

---

## 15. Errores Comunes a Evitar

### ❌ Colores de Tailwind Directos

```tsx
// MAL
className="text-gray-500 bg-white border-gray-200"

// BIEN
className="text-muted-foreground bg-card border-border"
```

### ❌ Estilos Inline con Colores

```tsx
// MAL
style={{ color: '#333', backgroundColor: '#fff' }}

// BIEN
className="text-foreground bg-background"
```

### ❌ Crear Botones Personalizados

```tsx
// MAL
<button className="bg-blue-500 text-white px-4 py-2 rounded">
    Click
</button>

// BIEN
<Button variant="default">Click</Button>
```

### ❌ Ignorar Estados de Carga

```tsx
// MAL
<button onClick={handleSubmit}>Guardar</button>

// BIEN
<Button onClick={handleSubmit} isLoading={isLoading}>
    Guardar
</Button>
```

---

## 16. Recursos Adicionales

- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/docs
- **Lucide Icons**: https://lucide.dev/icons
- **Radix UI**: https://www.radix-ui.com/docs/primitives

---

*Última actualización: Diciembre 2024*
