import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isPreview }) => ({
  plugins: [react()],
  // `npm run preview` should serve the real prerendered files, like a host does.
  appType: isPreview ? 'mpa' : 'spa',
}));
