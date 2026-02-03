/**
 * @file App entry
 * @author Surmon <https://github.com/surmon-china>
 */

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { APP_VERSION, APP_PRIMARY_LANGUAGE, VITE_MODE } from './config'
import { LocaleProvider, Language } from '@/contexts/Locale'
import { ThemeProvider, Theme } from '@/contexts/Theme'
import { initI18next } from './i18n'
import { locales } from './locales'

import '@/styles/app.less'
import { App, router } from './App'

// init export router to global
window.router = router

// init library
dayjs.extend(duration)

// init i18next
const i18n = initI18next({ fallbackLanguage: APP_PRIMARY_LANGUAGE })

// init config
const INITIAL_LANGUAGE = (i18n.resolvedLanguage as Language) ?? APP_PRIMARY_LANGUAGE
const INITIAL_THEME = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? Theme.Dark
  : Theme.Light

// effects for document attrs
document.documentElement.lang = INITIAL_LANGUAGE
document.documentElement.dataset.theme = INITIAL_THEME

const handleThemeChange = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
}

// bind i18n with libs
const handleLocaleChange = (language: Language) => {
  // Other side effects when the i18next language changed.
  return i18n.changeLanguage(language).then(() => {
    dayjs.locale(locales[language].dayjs)
    document.documentElement.lang = language
  })
}

console.group('🔵 App booting up...')
console.table({ APP_VERSION, VITE_MODE, INITIAL_THEME, INITIAL_LANGUAGE })
console.groupEnd()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocaleProvider initialLanguage={INITIAL_LANGUAGE} onChange={handleLocaleChange}>
    <ThemeProvider initialTheme={INITIAL_THEME} onChange={handleThemeChange}>
      <App />
    </ThemeProvider>
  </LocaleProvider>
)
