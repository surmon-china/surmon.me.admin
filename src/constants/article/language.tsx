/**
 * @file Article language
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import Icon from '@ant-design/icons'
import type { GetProps } from 'antd'

interface EmojiIconProps extends Partial<GetProps<typeof Icon>> {
  symbol: string
  scale?: number
  offset?: number
}

const EmojiIcon: React.FC<EmojiIconProps> = ({ symbol, scale = 1.3, offset = -1, ...props }) => (
  <Icon
    {...props}
    component={() => (
      <span style={{ transform: `scale(${scale}) translateY(${offset}px)` }}>{symbol}</span>
    )}
  />
)

// 文章语言: https://github.com/surmon-china/nodepress/blob/main/src/constants/biz.constant.ts#L8
// language: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export enum ArticleLanguage {
  English = 'en', // English
  Chinese = 'zh', // 简体中文
  Multiple = 'mul' // 多语言混合
}

export const articleLanguages = [
  {
    id: ArticleLanguage.Chinese,
    name: '中文',
    icon: <EmojiIcon symbol="🇨🇳" />,
    color: 'default'
  },
  {
    id: ArticleLanguage.English,
    name: 'English',
    icon: <EmojiIcon symbol="🇺🇸" />,
    color: 'default'
  },
  {
    id: ArticleLanguage.Multiple,
    name: '多语言',
    icon: <EmojiIcon symbol="🌐" scale={1.1} offset={-1.6} />,
    color: 'default'
  }
]

const articleLanguagesMap = new Map(articleLanguages.map((item) => [item.id, item]))

export const getArticleLanguage = (language: ArticleLanguage) => {
  return articleLanguagesMap.get(language)!
}
