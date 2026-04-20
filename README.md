# Script Viewer

Vue 3 + TypeScript rewrite of the Script Viewer GitHub Pages app. The public route contract is unchanged:

- `/Script-Viewer/`
- `/Script-Viewer/list/:serviceType`
- `/Script-Viewer/plan/:serviceType/:planId/:type?`

## Development

1. Copy `.env.example` to `.env`.
2. Set:
   - `VITE_PCO_APP_ID`
   - `VITE_PCO_SECRET`
   - `VITE_CORS_PROXY_URL`
3. Install dependencies with `npm install`.
4. Start the app with `npm run dev`.

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` creates the production build in `dist/`.
- `npm run test` runs the Vitest suite.
- `npm run lint` runs ESLint.
- `npm run deploy` publishes `dist/` to GitHub Pages.

## Architecture

- `src/api/pcoClient.ts` contains low-level fetch, proxy, and auth behavior.
- `src/services/planningCenterService.ts` normalizes Planning Center data for the UI.
- `src/services/planTransforms.ts` handles clock calculation and template-driven row shaping.
- `src/composables/` contains the route-scoped loaders for plan lists and plan details.
- `src/config/planTemplates.ts` owns the view templates and service type options.

The app still uses browser-side Planning Center credentials for v1, but that behavior is isolated behind the typed API layer so proxy/auth can move server-side later without rewriting the UI.
