# Agent Guide

Read `CONTEXT.md` first, then verify against the live repository. Some handoff entries still mention the old `konduit/app` nesting; this repo is now the standalone Ferret frontend.

## Project Facts

- Root: `/Users/ktorz/Documents/Projects/ferret`
- Stack: Svelte 5, Vite, Navigo, vite-plugin-pwa, generated Konduit WASM bindings.
- Package manager: npm. Keep `package-lock.json` authoritative; do not introduce yarn/pnpm lockfiles.
- Main commands:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
- Deployment output: `dist/`, referenced by `wrangler.jsonc`.

## Architecture

- `src/App.svelte` is mostly shell and route composition.
- `src/routing.js` is the single route map. Add new screens there before wiring them into `App.svelte`.
- `src/model/index.js` owns Konduit lifecycle, global state, refresh behavior, and the public action surface consumed by screens.
- `src/model/wallet.js`, `channel.js`, `adaptor.js`, `connector.js`, `settings.js`, `fx.js`, and `ui.js` own focused persisted slices.
- `src/store.js` wraps localStorage-backed Svelte stores and serializes WASM/domain objects. Do not bypass it for persisted runtime objects.
- `src/kernel.js` is the WASM import boundary. Avoid importing generated WASM directly from screens, components, or helpers.
- `src/screens/**/controller.js` files hold route-local orchestration. Prefer extending local controllers over adding screen-specific state to the global model.

## Runtime Model

- App state starts from `model.STATE.BOOTING`, moves through unavailable/loading/ready/busy depending on the persisted signing key and Konduit bootstrap.
- Signing key storage key: `ferret.konduit.v1`.
- Other persisted keys include `ferret.settings.v1`, `ferret.wallet.v1`, `ferret.adaptor.v1`, `ferret.connector.v1`, `ferret.channel.v1`, `ferret.fx.v1`, and `ferret.ui.v1`.
- The channel model is singular. Do not reintroduce plural channel UI/state unless the product direction changes.
- Auto-refresh runs every 20 seconds only when ready and pending wallet/channel work exists.
- Network selection UI exists, but runtime config currently comes from `src/config.js` and defaults to preprod.

## Routes

Defined routes:

```txt
/
/pay
/pay/confirm
/pay/success
/history
/topup
/settings
/settings/adaptor
/settings/connector
/settings/network
/settings/language
/settings/currency
/settings/fx
/settings/wallet
/settings/wallet/exit
```

`/` renders launch/splash while the runtime is unavailable and home once the wallet is ready.

## Change Guidelines

- Keep changes mobile-first. Desktop layout is not the priority.
- Preserve the existing flat, high-contrast Ferret visual language unless the task explicitly changes design direction.
- Keep route-level state local where possible. Only add global model fields for shared domain state.
- Keep `src/config.js` as the source for predefined connector/adaptor endpoints.
- Use structured validators/helpers already present in `src/helpers/` and `src/model/settings.js`.
- Treat generated WASM files as external build artifacts; do not hand-edit them.
- The worktree may contain user changes. Inspect before editing and never revert unrelated changes.

## Verification

Run `npm run build` after code changes when the WASM bundle is present. If it fails because `src/wasm/konduit_wasm.js` is missing, report that setup blocker explicitly rather than masking it with unrelated edits.
