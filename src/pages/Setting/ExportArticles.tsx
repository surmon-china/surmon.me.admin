import React from 'react'
import { useShallowRef, useComputed } from 'veact'
import { Flex, Divider, Checkbox, Typography, Tabs } from 'antd'
import * as Icons from '@ant-design/icons'
import { getBlogArticleUrl } from '@/transforms/url'
import { Article, ArticleStatus } from '@/constants/article'
import { UniversalEditor, UnEditorLanguage } from '@/components/common/UniversalEditor'

export interface ExportArticlesProps {
  articles: Article[]
}

export const ExportArticles: React.FC<ExportArticlesProps> = (props) => {
  const publicArticlesOnly = useShallowRef(true)
  const handlePublicArticlesOnlyChange = (value: boolean) => {
    publicArticlesOnly.value = value
  }

  const filteredArticles = useComputed(() => {
    if (publicArticlesOnly.value) {
      return props.articles.filter((a) => a.status === ArticleStatus.Published)
    } else {
      return props.articles
    }
  })

  const filteredArticlesJsonString = useComputed(() => {
    return JSON.stringify(filteredArticles.value, null, 2)
  })

  const filteredArticlesMarkdown = useComputed(() => {
    return filteredArticles.value
      .map((article) => {
        return [
          `# ${article.title}`,
          ``,
          `## 文章信息`,
          `- 分类：${article.categories.map((c) => c.name || c.slug).join(', ')}`,
          `- 标签：${article.tags.map((t) => t.name || t.slug).join(', ')}`,
          `- 引言：${article.summary?.replace(/\n/g, ' ').trim() || '暂无引言'}`,
          `- 发布时间：${new Date(article.created_at!).toLocaleString('zh-CN', { hour12: false })}`,
          `- 原文链接：${getBlogArticleUrl(article.id!)}`,
          ``,
          `## 正文内容`,
          ``,
          `${article.content}`
        ]
          .join('\n')
          .trim()
      })
      .join('\n\n-----\n\n')
  })

  return (
    <>
      <Divider />
      <Flex justify="space-between">
        <Checkbox
          checked={publicArticlesOnly.value}
          onChange={(event) => handlePublicArticlesOnlyChange(event.target.checked)}
        >
          仅保留公开文章数据（ArticleStatus = Published）
        </Checkbox>
        <Typography.Text strong={publicArticlesOnly.value} disabled={!publicArticlesOnly.value}>
          已过滤 {props.articles.length - filteredArticles.value.length} 条非公开数据
        </Typography.Text>
      </Flex>
      <Divider />
      <Tabs
        size="middle"
        tabBarExtraContent={
          <span>
            关于{' '}
            <a href="https://llmstxt.org/" target="_blank" rel="noreferrer">
              LLMs.txt
            </a>{' '}
            文件标准
          </span>
        }
        items={[
          {
            key: 'json',
            icon: <Icons.FileOutlined />,
            label: 'JSON 格式原始数据',
            children: (
              <UniversalEditor
                rows={24}
                value={filteredArticlesJsonString.value}
                eid="app-all-articles-json"
                defaultLanguage={UnEditorLanguage.JSON}
                disabledLanguageSelect={false}
                disabledCacheDraft={true}
                disabledLineNumbers={true}
                disbaled={true}
              />
            )
          },
          {
            key: 'llm-markdown',
            icon: <Icons.FileMarkdownOutlined />,
            label: 'LLM 友好的 Markdown 全量文章',
            children: (
              <UniversalEditor
                rows={24}
                value={filteredArticlesMarkdown.value}
                eid="app-all-articles-llms-markdown"
                defaultLanguage={UnEditorLanguage.Markdown}
                disabledLanguageSelect={false}
                disabledCacheDraft={true}
                disabledLineNumbers={true}
                disbaled={true}
              />
            )
          }
        ]}
      />
    </>
  )
}
