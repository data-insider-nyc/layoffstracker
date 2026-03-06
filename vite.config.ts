import path from "path"
import tailwindcss from "@tailwindcss/vite"

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: "/layoffstracker",
  plugins: [react(), tailwindcss(), visualizer({
    open: false, // Automatically open the report in the browser
    filename: "bundle-analysis.html", // Output file for the report
  }), // Enable gzip compression
  compression(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});