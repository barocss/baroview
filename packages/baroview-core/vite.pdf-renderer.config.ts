import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/pdf-renderer.ts'),
      name: 'BaroViewCorePdfRenderer',
      fileName: 'pdf-renderer',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'pdf-renderer.js',
      },
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
