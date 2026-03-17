/**
 * @file App locales
 * @author Surmon <https://github.com/surmon-china>
 */

import { Language } from '@/contexts/Locale'
import type { Locale as AntdLocale } from 'antd/es/locale'

// dayjs locales
import dayjsEnUS from 'dayjs/locale/en'
import dayjsZhCN from 'dayjs/locale/zh-cn'
import dayjsZhTW from 'dayjs/locale/zh-tw'

// antd locales
import antdEnUS from 'antd/es/locale/en_US'
import antdZhCN from 'antd/es/locale/zh_CN'
import antdZhTW from 'antd/es/locale/zh_TW'

// i18n locales
import i18nEnUS from './locales/en-US.json'
import i18nZhCN from './locales/zh-CN.json'
import i18nZhTW from './locales/zh-TW.json'

interface LocaleItem {
  i18n: Record<string, any>
  dayjs: typeof dayjsEnUS
  antd: AntdLocale
}

// i18n locales map
export const locales: Record<Language, LocaleItem> = {
  [Language.English]: {
    i18n: i18nEnUS,
    dayjs: dayjsEnUS,
    antd: antdEnUS
  },
  [Language.SimplifiedChinese]: {
    i18n: i18nZhCN,
    dayjs: dayjsZhCN,
    antd: antdZhCN
  },
  [Language.TraditionalChinese]: {
    i18n: i18nZhTW,
    dayjs: dayjsZhTW,
    antd: antdZhTW
  }
}
