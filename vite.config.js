import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base:"/Diplomnaya-rabota/",
  plugins: [react()],
  esbuild:{
    loader: 'jsx',
  },
  resolve:{
    alias:{
      './runtimeConfig': './runtimeConfig.browser'
    },
  },
  optimizeDeps:{
    esbuildOptions:{
      loader:{
        '.js': 'jsx',
      },
    },
  },
})
