import path from 'path'
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import scss from 'rollup-plugin-scss';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image'
import visualizer from 'rollup-plugin-visualizer';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy';
import { uglify } from 'rollup-plugin-uglify';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

process.env.NODE_ENV = 'production';

const resolveFile = function(filePath) {
  return path.join(__dirname, filePath)
}

export default {
  input: './src/lib/index.js',
  output: [
    {
      sourcemap: 'inline',
      file: pkg.main,
      format: 'cjs',
      exports: 'named'
    }
  ],
  external: ['react', 'react-dom'],
  plugins: [
    alias({
      entries: {
        assets: resolveFile('src/assets'),
        components: resolveFile('src/components'),
        utils: resolveFile('src/utils'),
        contexts: resolveFile('src/contexts'),
        page: resolveFile('src/page'),
        api: resolveFile('src/api')
      }
    }),
    external(),
    json(),
    copy({
      targets: [
        { src: resolveFile('src/lib/index.d.ts'), dest: resolveFile('dist') }
      ]
    }),
    scss(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve({
      preferBuiltins: true,
      mainFields: ['browser']
    }),
    commonjs(),
    image(),
    uglify(),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify( 'production' )
      }
    }),
    visualizer()
  ]
};
