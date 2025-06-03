import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: '/',
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: process.env.NODE_ENV === 'development',
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        manifest: 'manifest.json',
        outDir: 'public/build',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },
    server: process.env.NODE_ENV === 'development' ? {
        hmr: {
            host: 'localhost',
            clientPort: 5173
        },
        host: '0.0.0.0',
        strictPort: true,
        port: 5173,
        cors: true,
        allowedHosts: [
            '.ngrok-free.app',
            'localhost',
            '127.0.0.1',
            '.hostinger.com',
            '.hostingerapp.com',
            '.hostingersite.com'
        ]
    } : undefined
});