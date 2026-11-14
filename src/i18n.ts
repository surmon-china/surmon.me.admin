/**
 * @file App i18n
 * @author Surmon <https://github.com/surmon-china>
 */

import i18next, { Resource, FallbackLng } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { Language } from '@/contexts/Locale'
import { locales } from './locales'
import { isDev } from './config'

// export i18n
export const i18n = i18next
export type I18n = typeof i18next

// export react-i18next
export { useTranslation, Translation, Trans } from 'react-i18next'
export type { UseTranslationOptions, TranslationProps, TransProps } from 'react-i18next'

// i18next resources
const i18nResources: Resource = Object.keys(locales).reduce<Resource>((acc, item) => {
  acc[item] = { translation: locales[item as Language].i18n }
  return acc
}, {})

// init i18next
export const initI18next = (options: { fallbackLanguage: FallbackLng }): I18n => {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      // https://www.i18next.com/overview/api
      // https://www.i18next.com/overview/configuration-options
      // MARK: Do not use `supportedLngs` option.
      // https://github.com/i18next/i18next/issues/1068#issuecomment-952821733
      // https://github.com/i18next/i18next-browser-languageDetector#getting-started
      debug: isDev,
      resources: i18nResources,
      fallbackLng: options.fallbackLanguage,
      // https://www.i18next.com/translation-function/interpolation#all-interpolation-options
      interpolation: {
        escapeValue: false
      },
      // https://github.com/i18next/i18next-browser-languageDetector#detector-options
      detection: {
        lookupLocalStorage: 'i18next-lang'
      }
    })

  return i18next
}
