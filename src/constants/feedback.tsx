/**
 * @file Feedback constant
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'
import { GeneralAuthorType } from './author'
import { IPLocation } from './general'
import { User } from './user'

export interface Feedback {
  _id: string
  id: number
  emotion: number
  emotion_text?: string
  emotion_emoji?: string
  content: string
  user: User | null
  author_name: string | null
  author_email: string | null
  author_type: GeneralAuthorType
  ip: string | null
  ip_location: IPLocation | null
  user_agent: string
  origin: string | null
  marked: boolean
  remark: string
  created_at: string
  updated_at: string
}

export enum MarkedState {
  No = 0,
  Yes = 1
}

export const markedStates = [
  {
    number: MarkedState.No,
    boolean: false,
    name: '未标记',
    icon: <Icons.StarOutlined />
  },
  {
    number: MarkedState.Yes,
    boolean: true,
    name: '已标记',
    icon: <Icons.StarFilled style={{ color: '#fadb14' }} />
  }
]

const markedStatesMap = new Map(markedStates.map((item) => [item.number, item]))

export const getMarkedByNumber = (number: number) => {
  return markedStatesMap.get(number)!
}

export const getMarkedByBoolean = (boolean: boolean) => {
  return markedStatesMap.get(boolean ? MarkedState.Yes : MarkedState.No)!
}
