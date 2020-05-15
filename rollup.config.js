import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
// import { terser } from 'rollup-plugin-terser';

const input = 'src/index.js';
const file = 'clipboard-encryption';
const fileName = 'ClipboardEncryption'
export default {
  input,
  output: [
    {
      file: `es/${file}.js`,
      format: 'es',
      name: fileName,
    },
    {
      file: `lib/${file}.js`,
      format: 'cjs',
      name: fileName,
    },
    {
      file: `umd/${file}.js`,
      format: 'umd',
      name: fileName,
    },
  ],
  plugins: [
    // terser(),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}