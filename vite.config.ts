import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Fills %SITE_URL% in index.html and emits sitemap.xml from the same value. */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
  </url>
</urlset>
`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Reads .env files plus the real environment (which wins), so these work
  // from either `.env` or a CI variable.
  const env = loadEnv(mode, process.cwd(), '')

  // base is set for GitHub Pages project sites (served from /<repo>/).
  // Override with BASE_PATH=/ to host at the root of a domain instead.
  const base = env.BASE_PATH || '/nso-icon-creator/'

  // Public absolute URL of the deployed site, used for canonical/OG tags and
  // the sitemap. Override with SITE_URL=https://example.com/ when the domain changes.
  const siteUrl = (env.SITE_URL || 'https://harissabil.github.io/nso-icon-creator/').replace(/\/?$/, '/')

  return {
    base,
    plugins: [react(), siteUrlPlugin(siteUrl)],
  }
})
