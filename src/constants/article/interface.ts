/**
 * @file Article interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue } from '../general'
import { Category } from '../category'
import { Tag } from '../tag'

import { ArticleStatus } from './status'
import { ArticleOrigin } from './origin'
import { ArticleLanguage } from './language'

export interface Article {
  _id: string
  id: number
  slug: string | null
  title: string
  summary: string
  content?: string
  keywords: string[]
  thumbnail?: string
  status: ArticleStatus
  origin: ArticleOrigin
  lang: ArticleLanguage
  featured: boolean
  unlisted: boolean
  disabled_comments: boolean
  stats?: {
    likes: number
    views: number
    comments: number
  }
  tags: Tag[]
  categories: Category[]
  extras: GeneralKeyValue[]
  updated_at?: string
  created_at?: string
}
