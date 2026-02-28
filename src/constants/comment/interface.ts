/**
 * @file Comment interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue, IPLocation } from '../general'
import { CommentAuthorType } from '../author'
import { CommentStatus } from './status'
import { CommentTargetType } from './target'
import { User } from '../user'

export interface Comment {
  id: number
  _id: string
  status: CommentStatus
  target_type: CommentTargetType
  target_id: number
  parent_id: number | null
  content: string
  user: User | null
  author_name: string
  author_email: string | null
  author_website: string | null
  author_email_hash: string | null
  author_type: CommentAuthorType
  likes: number
  dislikes: number
  ip: string | null
  ip_location: Partial<IPLocation> | null
  user_agent: string
  extras: GeneralKeyValue[]
  updated_at: string
  created_at: string
}
