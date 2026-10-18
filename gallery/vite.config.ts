import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/*
 * The policy every target runtime imposes in some form (an MV3 extension cannot
 * relax it at all). Applied to the built gallery only: the dev server injects
 * an inline preamble for hot reload, which no shipped product carries.
 */
export const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:";

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'csp',
      apply: 'build',
      transformIndexHtml: () => [
        { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
      ],
    },
  ],
  server: { port: 4310, strictPort: true },
  preview: { port: 4310, strictPort: true },
  build: { outDir: 'dist', emptyOutDir: true },
});
