# Docs layer (Next.js)

MDX docs with `@next/mdx`, rendered through the docs feature's own StyleX components.

## Adds

```
next.config.ts            replaces base: adds createMDX and pageExtensions
src/mdx-components.tsx    maps MDX elements to docs components (Next.js reads it by name)
src/app/docs/             layout.tsx renders DocsShell; each page is page.mdx
src/docs/                 DocsShell (entry), DocsSidebar, DocsNavLink, DocsArticle,
                          DocsHeading, DocsLink, DocsCode, docsNav
```

## Steps

1. If the request outlines the docs, replace the two placeholder pages with that outline: one `src/app/docs/<slug>/page.mdx` per page, and one entry per page in `src/docs/docsNav.ts`. Otherwise keep the placeholders.
2. Give each MDX element its own `Docs*` component in `src/docs/` and map it in `src/mdx-components.tsx`. Don't style MDX output inline.
3. Link the docs from the landing page with a `ButtonLink` to `/docs` in `HeroActions` if the site is a dev site.
