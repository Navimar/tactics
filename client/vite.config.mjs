import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "../dist", // Твоя настройка сборки
    emptyOutDir: true, // Очищать папку перед сборкой
    sourcemap: true, // Генерировать sourcemaps (опционально)
  },
  server: {
    host: "127.0.0.1",
    port: 3001, // Порт для Vite dev-сервера
    proxy: {
      // Проксируем всё, кроме фронтенд-файлов, на Express
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true, // Поддержка WebSocket для Socket.IO
      },
      "^.*\\.png$": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "^.*\\.wav$": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
