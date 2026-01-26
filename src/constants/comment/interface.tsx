/**
 * @file Comment interface
 * @author Surmon <https://github.com/surmon-china>
 */

import { GeneralKeyValue, IPLocation } from '../general'
import { CommentStatus } from './status'

export const COMMENT_GUESTBOOK_POST_ID = 0

export interface Comment {
  id: number
  _id: string
  pid: number
  post_id: number
  content: string
  status: CommentStatus
  likes: number
  dislikes: number
  agent: string
  author: {
    name: string
    site?: string
    email?: string
    email_hash: string | null
  }
  ip: string | null
  ip_location: IPLocation | null
  extras: GeneralKeyValue[]
  updated_at?: string
  created_at?: string
}
