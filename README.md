# FutBots

Responsive, interactive implementation of the FutBots Figma design. The mobile
screens follow the supplied 402 px layouts, with a companion desktop experience
derived from the same type, color, spacing, card, and motion system.

## Run locally

Requires Node.js `>=22.13.0`.

For the editable standalone version, double-click `index.html`. Its styling and
interactions are kept in `standalone.css` and `standalone.js`.

For the React development version:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm test
npm run lint
```

## Project structure

- `app/FutBotsApp.tsx` — screens, navigation, and interactions
- `app/globals.css` — responsive design system and Figma-matched layouts
- `index.html` — directly editable and openable standalone HTML
- `standalone-base.css`, `standalone.css`, and `standalone.js` — standalone styling and interactions
- `public/assets/` — locally stored Figma SVG icons, brand artwork, flags, and imagery
- `tests/rendered-html.test.mjs` — production render and asset checks

The repository is configured for GitHub Desktop through the existing `origin`
remote.
