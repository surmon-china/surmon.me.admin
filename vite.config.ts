import path from 'path'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import packageJSON from './package.json'

// HTML slots for injecting content into the head and body of the `index.html` file.
export const HTML_HEAD_SLOT = '<!-- HEAD_SLOT -->'
export const HTML_BODY_CLOSE_SLOT = '<!-- BODY_CLOSE_SLOT -->'

// Configuring Vite https://vite.dev/config
export default defineConfig(getDefaultConfig)

// Exported for direct overrides in other configurations.
export function getDefaultConfig(env: ConfigEnv): UserConfig {
  const envConfig = loadEnv(env.mode, '.')

  return {
    plugins: [viteReact()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJSON.version),
      __GITHUB_URL__: JSON.stringify(packageJSON.homepage),
      __API_URL__: JSON.stringify(envConfig.VITE_API_URL),
      __BLOG_URL__: JSON.stringify('https://surmon.me'),
      __ENABLED_HEADER_AD__: false,
      __ENABLED_HASH_ROUTER__: false
    },
    server: {
      open: true
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'antd',
                test: (id) => id.includes('node_modules/antd') || id.includes('@ant-design/icons')
              },
              {
                name: 'codemirror',
                test: (id) => id.includes('node_modules/@codemirror')
              },
              {
                name: 'echarts',
                test: (id) => id.includes('node_modules/echarts')
              }
            ]
          }
        }
      }
    }
  }
}
