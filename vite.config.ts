import { defineConfig } from 'vite'
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
    // host: "app.plurality.local",
    hmr: {
      overlay: false, // Disable the error overlay
    },
  },
  optimizeDeps: {
    exclude: ['crypto'],
  },
  define: {
    // Define environment variables accessible in your application code
    'process.env': process.env,
    global: 'globalThis',
  }
})
