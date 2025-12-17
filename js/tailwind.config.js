// Tailwind CSS Configuration for Rinzin Dorji Portfolio
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'brand': {
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    900: '#14532d'
                },
                'dark': {
                    800: '#1e293b',
                    900: '#0f172a'
                }
            },
            fontFamily: {
                'sans': ['Outfit', 'sans-serif'],
                'serif': ['Playfair Display', 'serif']
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' }
                }
            },
            backdropBlur: {
                xs: '2px'
            }
        }
    }
}