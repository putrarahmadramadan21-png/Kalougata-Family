
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Memungkinkan penggunaan process.env di browser untuk API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
