import { defineConfig } from 'vite'
import { getDefaultConfig, HTML_HEAD_SLOT } from './vite.config.ts'

const GOOGLE_ANALYTICS_ID = 'G-WNSSKPKKMG'
const GOOGLE_ADSENSE_ID = 'ca-pub-4710915636313788'

const GOOGLE_ANALYTICS_SCRIPT = `
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GOOGLE_ANALYTICS_ID}');
  </script>
`

const GOOGLE_ADSENSE_SCRIPT = `
  <script
    async
    crossorigin="anonymous"
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_ID}"
  ></script>
`

export default defineConfig((env) => {
  const config = getDefaultConfig(env)

  config.define ??= {}
  Object.assign(config.define, {
    ...config.define,
    __API_URL__: JSON.stringify('/'),
    __ENABLED_HEADER_AD__: true,
    __ENABLED_HASH_ROUTER__: true
  })

  config.plugins ??= []
  config.plugins.push({
    name: 'demo-html-transform',
    transformIndexHtml: {
      // Must use `pre` to ensure the <script> tag is injected before Vite performs its HTML transformations.
      // This allows Vite to correctly apply special handling for `%BASE_URL%`.
      order: 'pre',
      handler(html) {
        return html.replace(
          HTML_HEAD_SLOT,
          [
            // Inject BASE_URL into the global scope via the Vite HTML template syntax.
            // This exposes `BASE_URL` on `window.DEMO_BASE_URL`, which is then used by the demo scripts to construct runtime URLs.
            // Reference: https://vite.dev/guide/env-and-mode.html#html-constant-replacement
            `<script>window.DEMO_BASE_URL = '%BASE_URL%'</script>`,
            // Load demo logic script.
            // Note: Vite will automatically prepend BASE_URL to the `src` path.
            // This script depends on the availability of `window.DEMO_BASE_URL`,
            // so it must be injected *after* the variable definition.
            `<script src="/__demo__/index.js"></script>`,
            // Inject Google Analytics and AdSense scripts for tracking and ads.
            GOOGLE_ANALYTICS_SCRIPT,
            GOOGLE_ADSENSE_SCRIPT
          ].join('\n')
        )
      }
    }
  })

  return config
})
