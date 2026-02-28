/**
 * @file Vote constant
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'
import { GeneralAuthorType } from './author'
import { IPLocation } from './general'
import { User } from './user'

export interface Vote {
  _id: string
  id: number
  target_type: VoteTargetType
  target_id: number
  vote_type: VoteType
  user: User | null
  author_name: string | null
  author_email: string | null
  author_type: GeneralAuthorType
  ip: string | null
  ip_location: Partial<IPLocation> | null
  user_agent: string
  created_at: string
  updated_at: string
}

export enum VoteType {
  Upvote = 1,
  Downvote = -1
}

export enum VoteTargetType {
  Article = 'article',
  Comment = 'comment'
}

const voteTargetTextsMap = new Map([
  [VoteTargetType.Article, '文章'],
  [VoteTargetType.Comment, '评论']
])

export const getVoteTargetText = (voteTarget: VoteTargetType) => {
  return voteTargetTextsMap.get(voteTarget)!
}

export const voteTypes = [
  {
    id: VoteType.Upvote,
    name: '+1',
    icon: <Icons.LikeOutlined />
  },
  {
    id: VoteType.Downvote,
    name: '-1',
    icon: <Icons.DislikeOutlined />
  }
]

const voteTypesMap = new Map(voteTypes.map((item) => [item.id, item]))

export const getVoteType = (voteType: VoteType) => {
  return voteTypesMap.get(voteType)!
}
