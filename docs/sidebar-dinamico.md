# Sistema de Sidebar Dinámico por Rol

Este documento explica cómo usar el nuevo sistema de sidebar dinámico que se adapta automáticamente al rol del usuario autenticado.

## Estructura del Sistema

### 1. Hook `useUserRole`
Ubicación: `src/core/hooks/auth/useUserRole.ts`

Hook personalizado que obtiene el rol del usuario autenticado y proporciona utilidades útiles:

```typescript
const { 
    role,           // Rol normalizado ('admin' | 'doctor' | 'nurse' | 'patient')
    rawRole,        // Rol original del backend
    isAuthenticated,
    loading,
    user,
    isAdmin,        // Booleanos de conveniencia
    isDoctor,
    isNurse,
    isPatient
} = useUserRole();
```

### 2. Tipos de Roles
Ubicación: `src/core/types/shared/roles.ts`

Define y normaliza los roles del sistema:
- Mapea roles del backend a roles normalizados
- Función `normalizeRole()` para conversión segura
- Tipos TypeScript para type safety

### 3. Componentes de Sidebar

#### `SmartSidebar`
Ubicación: `src/presentation/components/globals/sidebar/SmartSidebar.tsx`

Componente principal que decide qué sidebar mostrar:

```typescript
<SmartSidebar strategy="existing" /> // Usa sidebars existentes
<SmartSidebar strategy="dynamic" />  // Usa configuración centralizada
```

#### `RoleBasedSidebar`
Renderiza los componentes de sidebar existentes según el rol.

#### `DynamicSidebar`
Renderiza sidebars usando configuración centralizada de menús.

### 4. Configuración de Menús
Ubicación: `src/presentation/components/globals/sidebar/menuConfig.ts`

Centraliza toda la configuración de menús por rol:

```typescript
const menuConfig = getMenuConfigByRole(role);
// Retorna estructura con grupos y elementos de menú
```

### 5. Layouts Inteligentes

#### `SmartDashboardLayout`
Ubicación: `src/presentation/layouts/SmartDashboardLayout.tsx`

Layout que automáticamente muestra el sidebar correcto:

```typescript
<SmartDashboardLayout
    sidebarStrategy="existing"  // o "dynamic"
    customSidebar={<CustomSidebar />} // opcional
>
    {content}
</SmartDashboardLayout>
```

#### `UnifiedDashboard`
Ubicación: `src/presentation/pages/unified/UnifiedDashboard.tsx`

Dashboard unificado que funciona para todos los roles automáticamente.

## Uso Recomendado

### Opción 1: Usar Componentes Existentes (Recomendado)

Para mantener compatibilidad con el código existente:

```typescript
import { SmartDashboardLayout } from '../../layouts/SmartDashboardLayout';

export function MyDashboard() {
    return (
        <SmartDashboardLayout
            sidebarStrategy="existing"
            showSearch={true}
            variant="inset"
            collapsible="icon"
        >
            {/* Tu contenido aquí */}
        </SmartDashboardLayout>
    );
}
```

### Opción 2: Configuración Centralizada

Para mayor flexibilidad y mantenimiento:

```typescript
<SmartDashboardLayout sidebarStrategy="dynamic">
    {/* Tu contenido aquí */}
</SmartDashboardLayout>
```

### Opción 3: Dashboard Unificado

Para simplificar el routing:

```typescript
import { UnifiedDashboard } from '../presentation/pages/unified/UnifiedDashboard';

// En tu routing
{ path: "/dashboard", element: <UnifiedDashboard /> }
```

## Migración del Código Existente

### Paso 1: Dashboards Individuales

**Antes:**
```typescript
export function DoctorDashboard() {
    return (
        <DashboardLayout sidebar={<DoctorSidebar />}>
            <DoctorPage />
        </DashboardLayout>
    );
}
```

**Después:**
```typescript
export function DoctorDashboard() {
    return (
        <SmartDashboardLayout>
            <DoctorPage />
        </SmartDashboardLayout>
    );
}
```

### Paso 2: Routing Simplificado

**Antes:**
```typescript
const router = createBrowserRouter([
    { path: "/adminPage", element: <AdminDashboard /> },
    { path: "/doctorPage", element: <DoctorDashboard /> },
    { path: "/nursePage", element: <NurseDashboard /> },
    { path: "/patientPage", element: <PatientDashboard /> },
]);
```

**Después:**
```typescript
const router = createBrowserRouter([
    { path: "/dashboard", element: <UnifiedDashboard /> },
    // Mantener rutas específicas para compatibilidad
    { path: "/adminPage", element: <Navigate to="/dashboard" /> },
    { path: "/doctorPage", element: <Navigate to="/dashboard" /> },
    // ... etc
]);
```

## Ventajas del Nuevo Sistema

1. **Mantenimiento Centralizado**: Un solo lugar para configurar menús
2. **Type Safety**: TypeScript garantiza consistencia de tipos
3. **Flexibilidad**: Soporte para sidebars personalizados y estrategias múltiples
4. **Retrocompatibilidad**: Funciona con componentes existentes
5. **Principio de Responsabilidad Única**: Cada componente tiene una función específica
6. **Evita Duplicación**: Lógica centralizada para decidir qué mostrar

## Extensión del Sistema

### Agregar Nuevo Rol

1. Actualizar `ROLE_MAPPING` en `roles.ts`
2. Crear componente de sidebar específico
3. Agregar caso en `RoleBasedSidebar`
4. Configurar menús en `menuConfig.ts`
5. Agregar contenido en `UnifiedDashboard`

### Personalizar Menús

Editar `menuConfig.ts` y agregar/modificar elementos:

```typescript
const getDoctorMenuConfig = (): MenuConfig => ({
    groups: [
        {
            label: 'NUEVO GRUPO',
            items: [
                { title: 'Nuevo Item', url: '/nueva-ruta', icon: NewIcon }
            ]
        }
    ]
});
```

## Testing

El sistema incluye utilidades para testing:

```typescript
import { useUserRole } from '@/core/hooks/auth/useUserRole';
import { render } from '@testing-library/react';

// Mock del rol para testing
vi.mocked(useUserRole).mockReturnValue({
    role: 'admin',
    isAuthenticated: true,
    loading: false,
    // ...
});
```

## Troubleshooting

### Error: "Rol no reconocido"
- Verificar que el rol del usuario esté en `ROLE_MAPPING`
- Revisar la estructura del objeto usuario en localStorage

### Sidebar no aparece
- Verificar que el usuario esté autenticado
- Revisar que el componente esté dentro de `AuthProvider`

### Menús incorrectos
- Verificar la configuración en `menuConfig.ts`
- Asegurar que las rutas existan en el routing

## Próximos Pasos

1. Migrar gradualmente los dashboards existentes
2. Implementar tests unitarios para cada componente
3. Considerar lazy loading para componentes grandes
4. Agregar analítics para uso de menús
5. Implementar personalización de menús por usuario