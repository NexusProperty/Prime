# Tailwind Plus UI Blocks

Components downloaded from [Tailwind Plus](https://tailwindcss.com/plus) (Application UI & Marketing).

## Structure

- **application-ui/** — Application shells, forms, navigation, overlays, etc.
- **marketing/** — Heroes, features, CTAs, pricing, testimonials, etc.

## Downloaded So Far

- **application-ui/application-shells/stacked/** — 9 stacked layout variants
- **application-ui/application-shells/sidebar/** — 8 sidebar layouts
- **application-ui/application-shells/multi-column/** — 6 multi-column layouts
- **marketing/sections/heroes/** — 12 hero section variants

## How to Download More

The Playwright script (`npm run tailwind-ui:download`) requires login but may fail with headless browsers. Use the **Chrome DevTools MCP** approach:

1. Log in to https://tailwindcss.com/plus/login in the MCP browser
2. Run this in the page console to extract all components from the current category:

```javascript
(async () => {
  const links = document.querySelectorAll('a[href^="#component-"]');
  const codeTabs = Array.from(document.querySelectorAll('[role="tab"]')).filter(t => t.textContent?.trim() === 'Code');
  const results = [];
  for (let i = 0; i < Math.min(links.length, codeTabs.length); i++) {
    links[i].click();
    await new Promise(r => setTimeout(r, 400));
    codeTabs[i].click();
    await new Promise(r => setTimeout(r, 500));
    const code = document.querySelector('pre code')?.textContent;
    if (code && code.length > 100) results.push({ name: links[i].textContent?.trim(), code });
  }
  return results;
})();
```

3. Save the returned JSON to files (one `.tsx` per component).

## NPM Scripts

- `npm run tailwind-ui:download` — Download all (Application UI + Marketing in parallel)
- `npm run tailwind-ui:download:app` — Application UI only
- `npm run tailwind-ui:download:marketing` — Marketing only

Requires `TAILWIND_PLUS_EMAIL` and `TAILWIND_PLUS_PASSWORD` in `.env`.
