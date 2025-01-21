import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills()
  ],
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
    // host: "app.plurality.local",
    hmr: {
      overlay: false
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
