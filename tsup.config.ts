import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    external: ['react', 'react-dom'],
    // Компоненты с хуками нельзя рендерить в серверных компонентах Next.js без этой директивы.
    banner: { js: '"use client";' },
  },
  {
    entry: { styles: 'src/styles/index.css' },
    minify: true,
  },
]);
