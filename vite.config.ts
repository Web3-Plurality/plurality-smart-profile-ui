import { defineConfig } from 'vite'
// import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      global: resolve(__dirname, 'global-shim.js')
    }
  },
  server: {
    port: 3000,
  },
  define: {
    // Define environment variables accessible in your application code
    'process.env': process.env,
    global: 'globalThis',
  }
})
