import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource-variable/piazzolla';
import '@fontsource-variable/hanken-grotesk';
import './styles.css';
import App from './App';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Built pages arrive already rendered, so React only attaches to them.
// During `npm run dev` the page starts empty and React renders it fresh.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
