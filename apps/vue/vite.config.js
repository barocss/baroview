import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'baro-view' || tag === 'baro-view-item',
        },
      },
    }),
  ],
  server: { port: 5002 },
});
