import { Route, Routes } from 'react-router';
import Layout from './components/Layout';
import { projects } from './content/projects';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Project from './pages/Project';

const pages = (prefix) => [
  <Route key={`${prefix}home`} path={prefix || '/'} element={<Home />} />,
  ...projects.map((p) => (
    <Route key={prefix + p.slug} path={`${prefix}/work/${p.slug}`} element={<Project slug={p.slug} />} />
  )),
];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {pages('')}
        {pages('/uz')}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
