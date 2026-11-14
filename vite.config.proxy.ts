import { loadEnv, defineConfig } from 'vite'
import { getDefaultConfig } from './vite.config.ts'

const PROXY_API_URL = '/api'

export default defineConfig((env) => {
  const config = getDefaultConfig(env)
  const prodEnv = loadEnv('production', '.')

  config.define ??= {}
  Object.assign(config.define, {
    __API_URL__: JSON.stringify(PROXY_API_URL)
  })

  config.server ??= {}
  config.server.proxy = {
    ...(config.server.proxy || {}),
    [PROXY_API_URL]: {
      target: prodEnv.VITE_API_URL,
      rewrite: (path) => path.replace(/^\/api/, ''),
      changeOrigin: true,
      headers: {
        origin: 'https://surmon.me',
        referer: 'https://surmon.me'
      }
    }
  }

  return config
})
