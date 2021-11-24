module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.tsx'],
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
      white: '#ffffff',
      black: '#000000'
    },
    extend: {}
  },
  variants: {
    extend: {
      borderWidth: ['focus']
    }
  },
  plugins: []
}
