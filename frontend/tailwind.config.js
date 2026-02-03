/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Colors
                brand: {
                    dark: '#072C57',
                    DEFAULT: '#0C417D',
                    light: '#1a5ba8',
                },
                primary: {
                    50: '#e6eef7',
                    100: '#ccddef',
                    200: '#99bbdf',
                    300: '#6699cf',
                    400: '#3377bf',
                    500: '#0C417D',
                    600: '#0a3464',
                    700: '#08274b',
                    800: '#061a32',
                    900: '#040d19',
                    950: '#072C57',
                },
            },
        },
    },
    plugins: [],
}
