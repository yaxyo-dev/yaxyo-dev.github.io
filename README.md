# Yaxyo Nigmatov's portfolio

A portfolio site in English and Uzbek, built with React and Vite. Every page is prerendered to static HTML, so it loads fast, works without JavaScript, and shows up properly in search results and link previews.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Uzbek is at http://localhost:5173/uz/.

## Change the content

You shouldn't need to touch any components to update the site. All the words and details are in three files:

| To change | Edit |
| --- | --- |
| Your name, email, links, portrait | `src/content/profile.js` |
| Hero, business offer, about, contact | `src/content/ui.js` |
| Projects and case studies | `src/content/projects.js` |

Text has an English version and an Uzbek version. When you change one, change the other too.

### Add your portrait

Put a square photo in `public/`, for example `public/portrait.jpg`, then set `photo: '/portrait.jpg'` in `src/content/profile.js`.

### Change or remove the prices

Prices are in the `offer` block of `src/content/ui.js`, once for each language.

### Add a project

Copy an entry in `src/content/projects.js` and change it. Its `slug` becomes the page address, so `slug: 'my-project'` is published at `/work/my-project/`. Images go in `public/work/`, and a demo site goes in `public/demos/`.

To remove a project, delete its entry, then search `src/content/ui.js` for any sentences that mention it.

### When a demo becomes real client work

Change `status` for that project in `src/content/projects.js`, in both languages, and remove the "still a placeholder" section.

## Publish changes

The site lives at https://yaxyo-dev.github.io. Every push to `main` rebuilds and publishes it automatically, usually within a couple of minutes.

```bash
git add .
git commit -m "Describe your change"
git push
```

To check the built site on your computer first:

```bash
npm run build
npm run preview
```

If you move the site to another address, change `SITE_URL` in `src/content/profile.js`. The site expects to live at the top of a domain, not in a subfolder.
