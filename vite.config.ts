import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // plugins: [react(), VitePWA()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
      '/socket': {
        target: 'http://localhost:4001',
        changeOrigin: true,
      },
      '/graphql': {
        target: 'http://localhost:4001', // GraphQL endpoint
        changeOrigin: true,
      },
    },
  },
});
