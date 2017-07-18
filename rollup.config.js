import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import pkg from './package.json'

export default [
  // common js module
  {
    entry: 'src/main.js',
    plugins: [ buble() ],
    dest: pkg.main,
    format: 'cjs'
  },
  // browser script include
  {
    entry: 'src/main.js',
    plugins: [ buble(), uglify() ],
    moduleName: 'Oscilloscope',
    dest: 'oscilloscope.min.js',
    format: 'iife'
  }
]
