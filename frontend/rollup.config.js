import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import url from '@rollup/plugin-url'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssImport from 'postcss-import'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import tailwindcss from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting'

const extensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs']
const production = !process.env.ROLLUP_WATCH

const config = [{
  input: 'src/index.ts',
  output: [{
    format: 'iife',
    file: 'dist/index.js',
    sourcemap: true
  }],
  plugins: [
    resolve({
      browser: true,
      extensions
    }),
    url({
      include: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],
      limit: 0,
      destDir: 'dist/assets/fonts/',
      publicPath: 'assets/fonts/'
    }),
    url({
      include: ['**/*.svg', '**/*.png', '**/*.jp(e)?g', '**/*.gif', '**/*.webp'],
      limit: 0,
      destDir: 'dist/assets/images/',
      publicPath: 'assets/images/'
    }),
    json(),
    commonjs({
      include: /node_modules/
    }),
    postcss({
      plugins: [
        postcssImport(),
        tailwindNesting(),
        tailwindcss(),
        autoprefixer(),
        postcssFlexbugsFixes(),
        cssnano({
          preset: 'default'
        })
      ],
      extract: true,
      modules: {
        generateScopedName: '[hash:base64:5]',
        localsConvention: 'camelCaseOnly'
      }
    }),
    babel({
      extensions,
      include: ['src/**/*'],
      babelHelpers: 'runtime'
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    !production && serve({
      open: true,
      verbose: true,
      contentBase: ['public', 'dist'],
      port: 7280,
      historyApiFallback: true
    }),
    !production && livereload({
      watch: ['public', 'dist', 'src', 'tailwind.config.js']
    }),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
}]

// noinspection JSUnusedGlobalSymbols
export default config
