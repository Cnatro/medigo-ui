import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    port: 5173,
  },

  preview: {
    allowedHosts: ['medigo-ui.onrender.com']
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },

  test: {
    environment: 'jsdom',
  },
});