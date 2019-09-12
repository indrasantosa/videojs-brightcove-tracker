import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
      {
        name: 'howLongUntilLunch',
        file: pkg.browser,
        format: 'iife'
      }
    ],
    plugins: [json()]
  }
];
