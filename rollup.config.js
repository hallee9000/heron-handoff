import path from 'path'
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image'
import visualizer from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json'
import pkg from './package.json';

export default {
  input: './src/Canvas.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'esm'
    }
  ],
  plugins: [
    alias({
      entries: {
        '~assets/tokens.scss': path.resolve(__dirname, 'src/assets/tokens.scss'),
        assets: path.resolve(__dirname, 'src/assets'),
        components: path.resolve(__dirname, 'src/components'),
        utils: path.resolve(__dirname, 'src/utils'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        page: path.resolve(__dirname, 'src/page'),
        api: path.resolve(__dirname, 'src/api')
      }
    }),
    external(),
    json(),
    postcss(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs(),
    image(),
    visualizer()
  ]
};
