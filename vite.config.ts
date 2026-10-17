// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // Prerender the landing page to static HTML so it can be hosted on GitHub Pages.
    pages: [{ path: "/", prerender: { enabled: true } }],
  },
  vite: {
    // Relative asset paths so the build works both on Lovable and on GitHub Pages
    // (which serves the site under /starwarsspec/). GITHUB_PAGES=1 pins the
    // absolute prefix for the Pages build.
    base: process.env.GITHUB_PAGES ? "/starwarsspec/" : "./",
  },
});
