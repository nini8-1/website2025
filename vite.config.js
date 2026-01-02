import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],

  // 讓 Vite 知道要把 glb 當成資源處理
  assetsInclude: ['**/*.glb'],

  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
