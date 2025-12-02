import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../../../core/hooks/ui/useTheme';
import { cn } from '../../../core/utils/cn';

// Toggle de tema - Versión simple 

interface ThemeToggleProps {
  // Clases CSS adicionales
  className?: string;
  // Tamaño del botón
  size?: 'sm' | 'md' | 'lg';
  // Mostrar solo icono sin texto
  iconOnly?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  iconOnly = true,
}) => {
  const { resolvedTheme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8 p-1.5',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-2.5',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        // Estilos base
        'relative inline-flex items-center justify-center rounded-md',
        'bg-secondary/50 hover:bg-secondary',
        'text-foreground',
        'transition-all duration-200 ease-in-out',
        // Estilos de foco
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // Estado activo
        'active:scale-95',
        // Tamaño
        iconOnly ? sizeClasses[size] : 'px-4 py-2 gap-2',
        className
      )}
      aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      aria-pressed={isDark}
      title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      {/* Icono de sol - visible en modo oscuro */}
      <Sun
        size={iconSizes[size]}
        className={cn(
          'absolute transition-all duration-300',
          isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
        )}
        aria-hidden="true"
      />
      
      {/* Icono de luna - visible en modo claro */}
      <Moon
        size={iconSizes[size]}
        className={cn(
          'absolute transition-all duration-300',
          isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )}
        aria-hidden="true"
      />
      
      {!iconOnly && (
        <span className="ml-6 text-sm font-medium">
          {isDark ? 'Claro' : 'Oscuro'}
        </span>
      )}
      
      <span className="sr-only">
        {resolvedTheme === 'dark' ? 'Modo oscuro activo' : 'Modo claro activo'}
      </span>
    </button>
  );
};

// Selector de tema - Versión completa con dropdown

interface ThemeSwitcherProps {
  // Clases CSS adicionales
  className?: string;
  // Alineación del dropdown
  align?: 'start' | 'center' | 'end';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  align = 'end',
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Cerrar dropdown al hacer clic fuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar con Escape
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun size={16} className="text-warning" aria-hidden="true" />,
    },
    {
      value: 'dark',
      label: 'Oscuro',
      icon: <Moon size={16} className="text-primary" aria-hidden="true" />,
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: <Monitor size={16} className="text-muted-foreground" aria-hidden="true" />,
    },
  ];

  const handleSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {/* Botón disparador */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'h-10 px-3 rounded-md',
          'bg-secondary/50 hover:bg-secondary',
          'text-foreground text-sm font-medium',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'active:scale-95'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Seleccionar tema"
      >
        {resolvedTheme === 'dark' ? (
          <Moon size={18} aria-hidden="true" />
        ) : (
          <Sun size={18} aria-hidden="true" />
        )}
        <span className="hidden sm:inline">Tema</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label="Opciones de tema"
          className={cn(
            'absolute top-full mt-2 z-dropdown',
            'min-w-[140px] py-1',
            'bg-popover border border-border rounded-lg shadow-lg',
            'animate-scale-in origin-top',
            alignmentClasses[align]
          )}
        >
          {themes.map((item) => (
            <button
              key={item.value}
              type="button"
              role="option"
              aria-selected={theme === item.value}
              onClick={() => handleSelect(item.value)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 text-sm',
                'text-left transition-colors duration-150',
                'hover:bg-accent focus:bg-accent',
                'focus:outline-none',
                theme === item.value && 'bg-accent/50 font-medium'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
              {theme === item.value && (
                <svg
                  className="ml-auto h-4 w-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Script de inicialización del tema - Para evitar flash en carga inicial
// Script que debe incluirse en el <head> para prevenir FOUC (Flash of Unstyled Content)
// Usar en index.html antes de los estilos
export const themeInitScript = `
  (function() {
    const storageKey = 'medcore-theme';
    const stored = localStorage.getItem(storageKey);
    
    let theme;
    if (stored === 'dark' || stored === 'light') {
      theme = stored;
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.classList.add(theme);
  })();
`;

export default ThemeSwitcher;
