import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // server: {
  //   proxy: {
  //     '/api1': {
  //       target: 'http://api1:8002',
  //       changeOrigin: true,
  //     },
  //      '/api2': {
  //        target: 'http://api2:5000',
  //        changeOrigin: true,
  //      }
  //   }
  // },
  plugins: [react()],
});
