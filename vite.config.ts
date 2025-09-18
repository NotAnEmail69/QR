import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: ['.'], // Permitir acceso al sistema de archivos desde la raíz del proyecto
    },
  },
});
