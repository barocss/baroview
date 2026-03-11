import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BaroViewCDN',
      fileName: 'baroview-cdn',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
      },
    },
    sourcemap: true,
  },
});
