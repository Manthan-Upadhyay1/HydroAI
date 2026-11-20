# HydroAI Water Check (React)

A playful web app that lets anyone check water quality with the HydroAI neural network.
The ANN runs **inside the browser** (weights are exported from the notebook to `src/hydroai_model.json`), so there is no server, no API key and nothing a user types leaves their device.

## Run it
```
npm install
npm run dev        # http://localhost:5173
npm test           # checks the JavaScript model against the Python predictions
npm run build      # produces dist/index.html (one self-contained file)
```

## Deploy for free
Upload `dist/index.html` to any static host: Netlify Drop (drag and drop the file), GitHub Pages, Vercel, or Cloudflare Pages.

## Update the model
Re-run the notebook (`HydroAI_Pipeline.ipynb`); it writes `outputs/web/hydroai_model.json`. Copy that file to `src/hydroai_model.json`, run `npm test`, then `npm run build`.

## Structure
- `src/engine.js`  WQI formula + ANN forward pass + validation (no dependencies)
- `src/params.js`  plain-language text, slider scales, presets
- `src/components` Droppy mascot, gauge, input cards, result panel
- `src/pages`      Check, Learn, India, About
