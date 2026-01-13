import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/cart': 'http://localhost:4500',
      '/api/products': 'http://localhost:4400',
      '/api/auth': 'http://localhost:4000',
      '/api/payment': 'http://localhost:4300',
      '/api/orders': 'http://localhost:4200'
    }
  }
});
