/**
 * @file Announcement constants
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

export enum AnnouncementStatus {
  Draft = 0,
  Published = 1
}

export interface Announcement {
  _id?: string
  id?: number
  status: AnnouncementStatus
  content: string
  updated_at: string
  created_at: string
}

export const announcementStatuses = [
  {
    id: AnnouncementStatus.Draft,
    name: '草稿',
    icon: <Icons.SignatureOutlined />,
    color: 'orange'
  },
  {
    id: AnnouncementStatus.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  }
]

const announcementStatusesMap = new Map(announcementStatuses.map((item) => [item.id, item]))

export const getAnnouncementStatus = (status: AnnouncementStatus) => {
  return announcementStatusesMap.get(status)!
}
