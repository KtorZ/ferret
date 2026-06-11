# Ferret

Ferret is a mobile-first Svelte wallet for Lightning-fast ADA payments, backed by the [Konduit protocol](https://github.com/cardano-lightning/konduit). It is kept as a standalone frontend repository rather than nested inside the wider Konduit source tree.

The app targets a compact PWA-style experience: create or restore a wallet, top up the Cardano L1 wallet, open and manage one L2 channel, pay Lightning invoices through an adaptor, and inspect wallet/channel activity.

## Current Shape

- Svelte 5 + Vite app with PWA support.
- Konduit runtime is consumed through generated WASM bindings imported from `src/wasm/konduit_wasm.js`.
- `src/model/` owns the app state slices: wallet, channel, adaptor, connector, settings, FX, UI, and top-level runtime orchestration.
- `src/routing.js` defines browser-history routes with Navigo.
- Runtime config currently defaults to preprod Ferret services in `src/config.js`.
- Local state is persisted under `ferret.*.v1` localStorage keys.

## Setup

Install dependencies:

```sh
npm install
```

## Development

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Deployable static assets are emitted to `dist/`. `wrangler.jsonc` is configured to serve that directory through Cloudflare Workers assets.

## Repository Map

- `src/App.svelte`: app shell, route composition, header/toast/loading overlay wiring.
- `src/main.js`: Svelte mount, WASM logging hook, service-worker update handling.
- `src/kernel.js`: narrow import boundary for generated Konduit WASM bindings.
- `src/model/index.js`: Konduit bootstrap, global ready/busy state, refresh loop, exported app actions.
- `src/model/*.js`: focused persisted Svelte stores for domain slices.
- `src/screens/`: route-level screens and their local controllers.
- `src/components/`: reusable UI components.
- `src/helpers/`: formatting, filtering, URL, currency, transaction, and channel helpers.
- `src/config.js`: network, script address, connector, and adaptor defaults.
- `CONTEXT.md`: session handoff notes. Useful, but verify it against live files before relying on older entries.
