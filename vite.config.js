import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  server: {
    https: false,
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['6fc16a90cf05.ngrok-free.app'],
  },
  plugins: [
    {
      name: 'buffer-polyfill',
      transformIndexHtml() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module' },
            children: `
              import { Buffer } from 'buffer';
              window.Buffer = Buffer;
              window.global = window;
              window.process = { env: {} };
            `
          }
        ]
      }
    },
    nodePolyfills({
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `global`
      protocolImports: true,
    }),
    react()
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
    'globalThis.Buffer': 'Buffer',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      util: 'util',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'crypto-browserify', 'stream-browserify', 'util'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ton: ['@ton/core', '@ton/ton', '@ton/crypto'],
          ui: ['react-icons', 'react-toastify'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
}) 