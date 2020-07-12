import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/index.js',
      sourcemap: true,
    },
    {
      format: 'esm',
      file: 'dist/index.mjs',
      sourcemap: true,
    }
  ],

  plugins: [
    commonjs(),
    resolve(),
    typescript(),
  ],

  // Since this is a library, treat all dependencies as external.
  external: [ 'just-safe-get' ]
};
