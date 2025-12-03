/**
 * Hook para gestionar el tema (claro/oscuro) de la aplicación
 * 
 * Características:
 * - Persiste la preferencia en localStorage
 * - Respeta prefers-color-scheme del sistema cuando no hay preferencia
 * - Reactivo a cambios del sistema
 * - TypeScript con tipos seguros
 */

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface UseThemeReturn {
    /** Tema actual configurado (light, dark, o system) */
    theme: Theme;
    /** Tema resuelto aplicado actualmente (light o dark) */
    resolvedTheme: ResolvedTheme;
    /** Cambiar el tema */
    setTheme: (theme: Theme) => void;
    /** Alternar entre light y dark */
    toggleTheme: () => void;
    /** Si el tema oscuro está activo */
    isDark: boolean;
    /** Si el tema claro está activo */
    isLight: boolean;
}

const STORAGE_KEY = 'medcore-theme';

/**
 * Obtiene el tema del sistema operativo
 */
const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Obtiene el tema guardado en localStorage
 */
const getStoredTheme = (): Theme | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
    }
    return null;
};

/**
 * Aplica el tema al documento HTML
 */
const applyTheme = (resolvedTheme: ResolvedTheme): void => {
    const root = document.documentElement;

    // Remover ambas clases primero
    root.classList.remove('light', 'dark');

    // Agregar la clase correspondiente
    root.classList.add(resolvedTheme);

    // Actualizar meta theme-color para mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute(
            'content',
            resolvedTheme === 'dark' ? '#1a1a2e' : '#f8fdfd'
        );
    }
};

/**
 * Hook principal para gestionar el tema
 */
export function useTheme(): UseThemeReturn {
    // Inicializar con el tema guardado o 'system'
    const [theme, setThemeState] = useState<Theme>(() => {
        return getStoredTheme() || 'system';
    });

    // Resolver el tema actual (convierte 'system' al tema real)
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
        const stored = getStoredTheme();
        if (stored && stored !== 'system') {
            return stored;
        }
        return getSystemTheme();
    });

    // Actualizar el tema resuelto cuando cambia el tema o el sistema
    useEffect(() => {
        const updateResolvedTheme = () => {
            const resolved: ResolvedTheme = theme === 'system' ? getSystemTheme() : theme;
            setResolvedTheme(resolved);
            applyTheme(resolved);
        };

        updateResolvedTheme();

        // Escuchar cambios en la preferencia del sistema
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = () => {
                updateResolvedTheme();
            };

            // Usar addEventListener con fallback para browsers antiguos
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else {
                // @ts-ignore - fallback para Safari < 14
                mediaQuery.addListener(handleChange);
            }

            return () => {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener('change', handleChange);
                } else {
                    // @ts-ignore
                    mediaQuery.removeListener(handleChange);
                }
            };
        }
    }, [theme]);

    // Función para cambiar el tema
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
    }, []);

    // Función para alternar entre light y dark
    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    }, [resolvedTheme, setTheme]);

    return {
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
    };
}

export default useTheme;
