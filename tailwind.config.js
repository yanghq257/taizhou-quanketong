/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F2F7F4',
        ink: '#123B35',
        jade: {
          50: '#EFFAF6',
          100: '#D6F4E9',
          200: '#B0E8D8',
          300: '#7DD6C1',
          400: '#46BBA4',
          500: '#259F8A',
          600: '#177F71',
          700: '#11665D',
          800: '#10524C',
          900: '#0D433F',
          950: '#092F2C',
        },
        sand: '#FBF8F1',
        danger: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          400: '#EF7676',
          500: '#E55252',
          600: '#D63939',
          700: '#B42323',
          800: '#8D1D1D',
          900: '#731616',
        },
        amber: {
          50: '#FFF9EC',
          100: '#FEEDC7',
          200: '#F9D89A',
          500: '#D98816',
          600: '#B66A0A',
          700: '#95520A',
          800: '#744007',
          900: '#5A3206',
          950: '#3D2204',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        display: [
          '"Songti SC"',
          '"Noto Serif CJK SC"',
          'STSong',
          'SimSun',
          'serif',
        ],
      },
      boxShadow: {
        card: '0 10px 35px rgba(18, 59, 53, 0.06)',
        float: '0 16px 45px rgba(18, 59, 53, 0.14)',
      },
      borderRadius: {
        '4xl': '1.75rem',
      },
      maxWidth: {
        app: '1180px',
      },
    },
  },
  plugins: [],
}
