/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#072C57',
                    light: '#0C417D',
                },
                secondary: '#0C417D',
            }
        },
    },
    plugins: [],
}
