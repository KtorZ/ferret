import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

const FERRET_API_CACHE = 'cardano-v2';

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,wasm,css,html,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [],
      },
      manifest: {
        "name": "Ferret",
        "short_name": "Ferret",
        "description": "Lightning Fast ADA Payments.",
        "id": "/",
        "start_url": "/",
        "scope": "/",
        "display": "fullscreen",
        "display_override": ["fullscreen", "standalone", "minimal-ui"],
        "background_color": "#F4E9D7",
        "theme_color": "#D97D55",
        "orientation": "portrait",
        "prefer_related_applications": false,
        "icons": [
          {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          }
        ]
      }
    }),
  ],
})
