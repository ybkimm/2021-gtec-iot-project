import { readFileSync } from 'fs'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import url from '@rollup/plugin-url'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import ini from 'ini'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssNested from 'postcss-nested'
import livereload from 'rollup-plugin-livereload'
import postcss from 'rollup-plugin-postcss'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import tailwindcss from 'tailwindcss'

const extensions = ['.js', '.ts', '.jsx', '.tsx', '.mjs']
const production = !process.env.ROLLUP_WATCH

const configPaths = [
  '/etc/ina/config.ini',
  '/etc/ina.ini',
  './ina.ini',
  './config.ini'
]

const regexAddr = /^(?:[a-zA-Z][a-zA-Z0-9._-]*)?:([0-9]+)$/g

/**
 * Port number for development server.
 * @type {string}
 */
const devServerPort = (() => {
  for (let i = 0; i < configPaths.length; i++) {
    const configPath = configPaths[i]

    let config
    try {
      config = ini.parse(readFileSync(configPath, 'utf-8'))
    } catch (e) {
      continue
    }

    const addr = config['ina::frontend'].addr
    const caps = regexAddr.exec(addr)
    if (caps == null) {
      throw new Error('invalid addr; see ' + configPath)
    }

    return Number.parseInt(caps[1])
  }
})()

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
        tailwindcss(),
        postcssNested(),
        autoprefixer(),
        postcssFlexbugsFixes(),
        cssnano({
          preset: 'default'
        })
      ],
      modules: {
        generateScopedName: production ? '[hash:base64:8]' : '[name]__[local]___[hash:base64:5]'
      },
      extract: true
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
      port: devServerPort,
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
