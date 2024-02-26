import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue(),
  viteStaticCopy({
    targets: [
      { src: 'src/assets/admin', dest: 'assets' },
      { src: 'src/assets/frontend', dest: 'assets' },
      { src: 'src/assets/leetu-shop.svg', dest: 'assets' },
    ],
  }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
})
