import path from "path"
import tailwindcss from "@tailwindcss/vite"

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_URL ?? "/",
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: false,
      filename: "bundle-analysis.html",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-map': ['leaflet', 'react-leaflet'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-slot', '@radix-ui/react-tabs', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-table': ['@tanstack/react-table'],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
