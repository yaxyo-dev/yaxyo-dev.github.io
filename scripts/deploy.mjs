// Publishes the built site by committing the contents of dist/ to the
// gh-pages branch on GitHub. Run it with `npm run deploy`.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BRANCH = 'gh-pages';
const message = process.argv[2] || 'Publish site';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const git = (args, env = process.env) =>
  execFileSync('git', args, { cwd: root, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Snapshot dist/ using a temporary index, so your working files and the
// main branch aren't touched.
const index = path.join(git(['rev-parse', '--absolute-git-dir']), 'publish-index');
fs.rmSync(index, { force: true });
const env = { ...process.env, GIT_INDEX_FILE: index };
git(['--work-tree=dist', 'add', '-A', '.'], env);
const tree = git(['write-tree'], env);
fs.rmSync(index, { force: true });

// Build on what's already published, if anything is.
let parent = null;
try {
  git(['fetch', 'origin', BRANCH]);
  parent = git(['rev-parse', 'FETCH_HEAD']);
} catch {
  console.log('Publishing for the first time.');
}

if (parent && git(['rev-parse', `${parent}^{tree}`]) === tree) {
  console.log('Nothing new to publish.');
  process.exit(0);
}

const commit = git(['commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', message]);
execFileSync('git', ['push', 'origin', `${commit}:refs/heads/${BRANCH}`], { cwd: root, stdio: 'inherit' });
console.log('Published. GitHub usually updates the site within a couple of minutes.');
