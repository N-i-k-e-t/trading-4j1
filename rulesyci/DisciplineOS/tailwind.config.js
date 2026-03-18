/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                calmBlue: '#4AC76A',
                focusedSlate: '#2C3E4C',
                steadyGray: '#555B65',
                neutralSand: '#EAE6E0',
                clearWhite: '#FAFAFA',
                mutedTeal: '#6A8E84',
                alertAmber: '#D4A574',
            },
        },
    },
    plugins: [],
}
