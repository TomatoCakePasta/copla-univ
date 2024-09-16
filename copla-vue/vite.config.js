import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    proxy: {
      "/api" : {
        // バックエンドサーバのURL
        // target: "http://localhost:3000",
        target: "https://copla-univ.onrender.com",
        changeOrigin: true,
        // /api プレフィックスを削除して転送
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/socket.io" : {
        // target: "http://localhost:3000",
        target: "https://copla-univ.onrender.com",
        changeOrigin: true,
        ws: true,
        // rewrite: (path) => path.replace(/^\/socket.io/, ""),
      },
      "/images" : {
        // バックエンドサーバのURL
        target: "http://localhost:3000",
        changeOrigin: true,
        // /api プレフィックスを削除して転送
        rewrite: (path) => path.replace(/^\/imgaes/),
      },
    },
  },
});
