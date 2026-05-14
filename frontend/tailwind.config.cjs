module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sketch: ['Patrick Hand', 'Comic Sans MS', 'Segoe Print', 'cursive'],
        main: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        sketch: {
          ink: '#202020',
          paper: '#FFFDF4',
          primary: '#2F80ED',
          secondary: '#FF6B6B',
          accent: '#FFE66D',
          mint: '#72E0A8',
          success: '#16A34A',
          error: '#EF4444',
          light: '#F7FBFF',
          dark: '#202020',
        },
      },
      boxShadow: {
        sketch: '5px 5px 0px #202020',
        'sketch-lg': '9px 9px 0px #202020',
        'sketch-hover': '3px 3px 0px #202020',
      },
      borderRadius: {
        sketch: '8px',
      },
    },
  },
  plugins: [],
};
