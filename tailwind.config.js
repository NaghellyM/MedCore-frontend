/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			/* ==========================================================================
			   COLOR SYSTEM - Usando variables CSS para soporte de temas
			   ========================================================================== */
			colors: {
				/* Colores semánticos del sistema de diseño */
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
					hover: "hsl(var(--primary-hover))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
					hover: "hsl(var(--secondary-hover))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
					light: "hsl(var(--destructive-light))",
				},
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
					light: "hsl(var(--success-light))",
				},
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
					light: "hsl(var(--warning-light))",
				},
				info: {
					DEFAULT: "hsl(var(--info))",
					foreground: "hsl(var(--info-foreground))",
					light: "hsl(var(--info-light))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				
				/* Sidebar colors */
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
				
				/* Chart colors */
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
				
				/* Legacy colors - mantener por compatibilidad durante migración */
				'cuidarte-primary': '#8DBCC7',
				'cuidarte-secondary': '#A4CCD9',
				'cuidarte-tertiary': '#C4E1E6',
				'cuidarte-accent': '#647FBC',
			},
			
			/* ==========================================================================
			   TYPOGRAPHY
			   ========================================================================== */
			fontFamily: {
				sans: ['Inter', 'Saira', 'system-ui', '-apple-system', 'sans-serif'],
				display: ['Fjalla One', 'Inter', 'sans-serif'],
				fjalla: ['Fjalla One', 'sans-serif'],
				saira: ['Saira', 'sans-serif'],
			},
			fontSize: {
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
			},
			
			/* ==========================================================================
			   BORDER RADIUS
			   ========================================================================== */
			borderRadius: {
				lg: "var(--radius-lg)",
				md: "var(--radius-md)",
				sm: "var(--radius-sm)",
				xl: "var(--radius-xl)",
				"2xl": "var(--radius-2xl)",
			},
			
			/* ==========================================================================
			   SHADOWS
			   ========================================================================== */
			boxShadow: {
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'inner': 'var(--shadow-inner)',
				'card': '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 4px 12px -4px rgba(0, 0, 0, 0.05)',
				'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -4px rgba(0, 0, 0, 0.08)',
				'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
				'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
			},
			
			/* ==========================================================================
			   SPACING (extendiendo los valores por defecto de Tailwind)
			   ========================================================================== */
			spacing: {
				'18': '4.5rem',
				'22': '5.5rem',
			},
			
			/* ==========================================================================
			   TRANSITIONS
			   ========================================================================== */
			transitionDuration: {
				'fast': '150ms',
				'normal': '200ms',
				'slow': '300ms',
			},
			
			/* ==========================================================================
			   ANIMATIONS
			   ========================================================================== */
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"collapsible-down": {
					from: { height: "0" },
					to: { height: "var(--radix-collapsible-content-height)" },
				},
				"collapsible-up": {
					from: { height: "var(--radix-collapsible-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"fade-out": {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
				"scale-in": {
					from: { transform: "scale(0.95)", opacity: "0" },
					to: { transform: "scale(1)", opacity: "1" },
				},
				"slide-in-from-top": {
					from: { transform: "translateY(-100%)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
				"slide-in-from-bottom": {
					from: { transform: "translateY(100%)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
				"slide-in-from-left": {
					from: { transform: "translateX(-100%)", opacity: "0" },
					to: { transform: "translateX(0)", opacity: "1" },
				},
				"slide-in-from-right": {
					from: { transform: "translateX(100%)", opacity: "0" },
					to: { transform: "translateX(0)", opacity: "1" },
				},
				"pulse-soft": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.7" },
				},
				"shimmer": {
					"0%": { backgroundPosition: "-200% 0" },
					"100%": { backgroundPosition: "200% 0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"collapsible-down": "collapsible-down 0.2s ease-out",
				"collapsible-up": "collapsible-up 0.2s ease-out",
				"fade-in": "fade-in 0.2s ease-out",
				"fade-out": "fade-out 0.15s ease-in",
				"scale-in": "scale-in 0.2s ease-out",
				"slide-in-from-top": "slide-in-from-top 0.3s ease-out",
				"slide-in-from-bottom": "slide-in-from-bottom 0.3s ease-out",
				"slide-in-from-left": "slide-in-from-left 0.3s ease-out",
				"slide-in-from-right": "slide-in-from-right 0.3s ease-out",
				"pulse-soft": "pulse-soft 2s ease-in-out infinite",
				"shimmer": "shimmer 2s linear infinite",
			},
			
			/* ==========================================================================
			   Z-INDEX SCALE
			   ========================================================================== */
			zIndex: {
				'dropdown': '50',
				'sticky': '100',
				'fixed': '200',
				'modal-backdrop': '300',
				'modal': '400',
				'popover': '500',
				'tooltip': '600',
				'toast': '700',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
