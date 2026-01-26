/**
 * @file Comment status
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

export enum CommentStatus {
  Pending = 0, // 待审核
  Published = 1, // 已发布
  Trash = -1, // 回收站
  Spam = -2 // 垃圾评论
}

export const commentStatuses = [
  {
    id: CommentStatus.Pending,
    name: '待审核',
    icon: <Icons.EditOutlined />,
    color: 'blue'
  },
  {
    id: CommentStatus.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  },
  {
    id: CommentStatus.Trash,
    name: '回收站',
    icon: <Icons.DeleteOutlined />,
    color: 'orange'
  },
  {
    id: CommentStatus.Spam,
    name: '垃圾评论',
    icon: <Icons.StopOutlined />,
    color: 'red'
  }
]

const commentStatusesMap = new Map(commentStatuses.map((item) => [item.id, item]))

export const getCommentStatus = (status: CommentStatus) => {
  return commentStatusesMap.get(status)!
}
