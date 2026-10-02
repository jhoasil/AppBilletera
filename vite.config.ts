import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { VitePWA } from 'vite-plugin-pwa';

const paquete = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  plugins: [react(), VitePWA({ registerType: 'prompt', injectRegister: 'script', includeAssets: ['icono.svg', 'icono-192.png', 'icono-512.png'], manifest: { name: 'AppBilletera', short_name: 'AppBilletera', description: 'Ingresos, gastos y billeteras sin conexión', lang: 'es-AR', start_url: '/#/inicio', scope: '/', display: 'standalone', theme_color: '#0064ff', background_color: '#f6f8fc', icons: [{ src: '/icono-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }, { src: '/icono.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }] }, workbox: { globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'], cleanupOutdatedCaches: true, navigateFallback: 'index.html' } })],
  define: { __VERSION_APLICACION__: JSON.stringify(paquete.version), __BUILD_APLICACION__: JSON.stringify(process.env.APP_BUILD ?? 'desarrollo') },
});
