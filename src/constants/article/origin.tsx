/**
 * @file Article origin state
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import * as Icons from '@ant-design/icons'

export enum ArticleOrigin {
  Original = 0, // 原创
  Reprint = 1, // 转载
  Hybrid = 2 // 混合
}

export const articleOrigins = [
  {
    id: ArticleOrigin.Original,
    name: '原创',
    icon: <Icons.EditOutlined />,
    color: 'default'
  },
  {
    id: ArticleOrigin.Reprint,
    name: '转载',
    icon: <Icons.CopyOutlined />,
    color: 'default'
  },
  {
    id: ArticleOrigin.Hybrid,
    name: '混合',
    icon: <Icons.PullRequestOutlined />,
    color: 'default'
  }
]

const articleOriginsMap = new Map(articleOrigins.map((item) => [item.id, item]))

export const getArticleOrigin = (origin: ArticleOrigin) => {
  return articleOriginsMap.get(origin)!
}
