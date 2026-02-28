/**
 * @file Global config
 * @author Surmon <https://github.com/surmon-china>
 */

import type { PaginationProps } from 'antd/lib/pagination'
import type { SizeType } from 'antd/lib/config-provider/SizeContext'
import { Language } from '@/contexts/Locale'

// vite envs
export const VITE_ENV = import.meta.env
export const VITE_MODE = import.meta.env.MODE
export const isDev = import.meta.env.DEV

// defined in .env
export const APP_BASE_URL = import.meta.env.BASE_URL as string
// defined in vite.config.ts
export const API_URL = __API_URL__ ?? import.meta.env.VITE_API_URL
export const APP_VERSION = __APP_VERSION__
export const BLOG_BASE_URL = __BLOG_URL__
export const GITHUB_REPO_URL = __GITHUB_URL__
export const ENABLED_HEADER_AD = Boolean(__ENABLED_HEADER_AD__)
export const ENABLED_HASH_ROUTER = Boolean(__ENABLED_HASH_ROUTER__)

// Antd config
export const APP_PAGE_SIZE_OPTIONS: PaginationProps['pageSizeOptions'] = ['16', '32', '50']
export const APP_CONTENT_SPACE_SIZE: SizeType = 'middle'
export const APP_LAYOUT_SPACE_SIZE: SizeType = 'large'
export const APP_LAYOUT_GUTTER_SIZE = 24
export const APP_PRIMARY_COLOR = '#0088f5'
export const APP_PRIMARY_LANGUAGE = Language.English
export const APP_AUTH_HEADER_KEY = 'Authorization'

// App config
export const APP_DB_NAME = 'AdminApp'
export enum AppDbStoreName {
  AiHistory = 'ai_history',
  EditorCache = 'editor_cache'
}
export enum AppLocalStorageKey {
  IdToken = 'id_token',
  TokenBirthTime = 'token_birth_time',
  TokenExpiresIn = 'token_expires_in'
}
