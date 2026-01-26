/**
 * @file Article publish status
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

export enum ArticleStatus {
  Draft = 0, // 草稿
  Published = 1, // 已发布
  Private = 2, // 私有
  Trash = -1 // 回收站
}

export const articleStatuses = [
  {
    id: ArticleStatus.Draft,
    name: '草稿',
    icon: <Icons.SignatureOutlined />,
    color: 'orange'
  },
  {
    id: ArticleStatus.Published,
    name: '已发布',
    icon: <Icons.CheckOutlined />,
    color: 'green'
  },
  {
    id: ArticleStatus.Trash,
    name: '回收站',
    icon: <Icons.DeleteOutlined />,
    color: 'red'
  },
  {
    id: ArticleStatus.Private,
    name: '私密',
    icon: <Icons.LockOutlined />,
    color: 'magenta'
  }
]

const articleStatuseshMap = new Map(articleStatuses.map((item) => [item.id, item]))

export const getArticleStatus = (status: ArticleStatus) => {
  return articleStatuseshMap.get(status)!
}
