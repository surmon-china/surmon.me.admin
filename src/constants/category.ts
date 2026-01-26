/**
 * @file Category constant
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from './general'

export interface Category {
  _id?: string
  id?: number
  pid?: string | null
  name: string
  slug: string
  description: string
  children?: Category[]
  extras: GeneralKeyValue[]
  updated_at: string
  created_at: string
  article_count?: number
}
