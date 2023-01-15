module.exports = {
    content: ["./src/**/*.{pug,html,mjs}", "safelist.txt"],
    theme: {
        extend: {
            colors: {
                lime: {
                    950: '#3ff110',
                },
            }
        },
        container: {
            center: true,
            padding: '2rem'
        },
        fontFamily: {
            sans: ['Cabin', 'sans-serif'],
            mono: ['"Ubuntu Mono"']
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ]
}