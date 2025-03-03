import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Define environment variables to be exposed to the client
  define: {
    // Expose environment variables with the VITE_ prefix
    'import.meta.env.VITE_APP_DOMAIN': JSON.stringify(process.env.VITE_APP_DOMAIN || 'http://localhost:3000'),
  },
});