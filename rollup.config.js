import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  // Unminified version
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main + '.js', format: 'cjs' },
      { file: pkg.module + '.js', format: 'es' },
      {
        name: 'howLongUntilLunch',
        file: pkg.browser + '.js',
        format: 'iife'
      }
    ],
    plugins: [json()]
  },
  // Minified version
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main + '.min.js', format: 'cjs' },
      { file: pkg.module + '.min.js', format: 'es' },
      {
        name: 'howLongUntilLunch',
        file: pkg.browser + '.min.js',
        format: 'iife'
      }
    ],
    plugins: [json(), terser({ sourcemap: true })]
  }
];
