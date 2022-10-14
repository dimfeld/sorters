import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/index.cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      format: 'esm',
      file: 'dist/index.js',
      sourcemap: true,
    }
  ],

  plugins: [
    commonjs(),
    resolve(),
    typescript({ tsconfig: 'tsconfig.build.json' }),
  ],
};
