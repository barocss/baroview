import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/markdown-renderer.ts'),
      name: 'BaroViewCoreMarkdownRenderer',
      fileName: 'markdown-renderer',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'markdown-renderer.js',
      },
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
