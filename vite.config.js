import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Single-file build: everything (code, model weights, styles) is inlined into dist/index.html,
// so the app can be opened or hosted anywhere as one static file.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: 'es2019', chunkSizeWarningLimit: 4000 },
});
