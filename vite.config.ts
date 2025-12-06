import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Set base path: GitHub Pages uses subpath, CloudBase/Vercel use root
    // VITE_BASE_PATH can be explicitly set (empty string or '/' for root)
    let base = '/';
    if (process.env.VITE_BASE_PATH !== undefined) {
        base = process.env.VITE_BASE_PATH || '/';
    } else if (process.env.GITHUB_PAGES === 'true') {
        base = '/Kumo-s-Portfolio/';
    }
    
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize build output
        target: 'es2015',
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: false,
        rollupOptions: {
          output: {
            // Code splitting for better caching
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'framer-motion': ['framer-motion'],
              'lucide-react': ['lucide-react'],
            },
            // Optimize chunk file names
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          },
        },
        // Chunk size warning limit
        chunkSizeWarningLimit: 1000,
      },
    };
});
