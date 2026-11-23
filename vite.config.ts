import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { msw } from "msw/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react(), tailwindcss(), msw()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
})
