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
                    50: '#f0f4ff',
                    100: '#d9e2ff',
                    200: '#bcd0ff',
                    300: '#8eb0ff',
                    400: '#5e85ff',
                    500: '#3350ff',
                    600: '#2238ff',
                    700: '#1c2be0',
                    800: '#1722b5',
                    900: '#111991',
                },
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
                surface: {
                    light: '#ffffff',
                    dark: '#0f172a',
                }
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