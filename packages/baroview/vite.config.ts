import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BaroView',
      fileName: 'baroview',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['baroview-core', 'baroview-core/markdown-renderer'],
      output: {
        globals: {
          'baroview-core': 'BaroViewCore',
          'baroview-core/markdown-renderer': 'BaroViewCoreMarkdownRenderer',
        },
      },
    },
    sourcemap: true,
  },
});
