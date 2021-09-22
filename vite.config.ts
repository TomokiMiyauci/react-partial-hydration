import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { peerDependencies } from './package.json'

const external = Object.keys(peerDependencies)
const baseDir = resolve(__dirname, 'lib')

export default defineConfig({
  resolve: {
    alias: {
      '@': baseDir
    }
  },
  plugins: [reactRefresh()],
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  build: {
    lib: {
      entry: resolve(baseDir, 'index.ts'),
      formats: ['cjs', 'es'],
      fileName: 'index'
    },
    rollupOptions: {
      external
    }
  }
})
