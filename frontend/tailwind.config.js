/* eslint-disable quote-props */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  content: ['./src/**/*.tsx'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      red: '#f13b59',
      yellow: '#ffeb3b',
      green: '#90d093',
      blue: {
        light: '#93c5fd',
        DEFAULT: '#60a5ff'
      },
      darkblue: '#3c3f59',
      gray: {
        100: '#f3f3f3',
        200: '#e0e0e0',
        DEFAULT: '#888888'
      },
      white: '#ffffff',
      black: '#000000'
    },
    extend: {
      minWidth: {
        '16': '4rem',
        '20': '5rem',
        '24': '6rem'
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    plugin(({ addVariant }) => {
      addVariant('isActive', '&.isActive')
    })
  ]
}
