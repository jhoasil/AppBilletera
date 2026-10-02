import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

const paquete = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  plugins: [react()],
  define: { __VERSION_APLICACION__: JSON.stringify(paquete.version), __BUILD_APLICACION__: JSON.stringify(process.env.APP_BUILD ?? 'desarrollo') },
});
