import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';

export { allPaths, headTags, pageMeta } from './lib/head';
export { SITE_URL } from './content/profile';

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
