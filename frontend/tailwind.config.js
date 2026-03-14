/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#3352ff',
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#3352ff',
                    600: '#253cdc',
                    700: '#1d2ca3',
                    800: '#1e2881',
                    900: '#1e2468',
                },
                "accent-neon": "#00f2ff",
                "background-light": "#f5f6f8",
                "background-dark": "#07080f",
                "surface": "#121421",
                "glass-border": "rgba(255, 255, 255, 0.12)",
                "glass-bg": "rgba(255, 255, 255, 0.03)",
                "emerald-accent": "#10b981",
                "amber-accent": "#f59e0b",
                "rose-accent": "#f43f5e",
                secondary: {
                    50: '#fdf2ff',
                    100: '#f8dfff',
                    200: '#f2beff',
                    300: '#eb8cff',
                    400: '#e14dff',
                    500: '#d11aff',
                    600: '#b800e6',
                    700: '#9100b3',
                    800: '#6b0085',
                    900: '#470058',
                },
                accent: '#00f2fe',
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'],
                display: ['"Space Grotesk"', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'typing': 'typing 2s steps(30, end)',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                typing: {
                    'from': { width: '0' },
                    'to': { width: '100%' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}