/**
 * @file Tag interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from './general'

export interface Tag {
  _id?: string
  id?: number
  name: string
  slug: string
  description: string
  extras: GeneralKeyValue[]
  updated_at: string
  created_at: string
  article_count?: number
}
