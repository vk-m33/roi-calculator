import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// TAURI_DEV_HOST is set by `tauri dev` when the frontend runs on a different host
const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Prevent Vite from obscuring Rust compile errors in the terminal
  clearScreen: false,

  server: {
    port: 5173,
    // Tauri expects a fixed port; fail if it's already in use
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: 'ws', host, port: 5183 }
      : undefined,
    watch: {
      // Don't trigger Vite reloads from Rust build artefacts
      ignored: ['**/src-tauri/**'],
    },
  },
})
