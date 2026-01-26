import React from 'react'
import { useLoading } from 'veact-use'
import { useShallowRef, useReactive, useComputed } from 'veact'
import { Button, Row, Flex, Divider, Modal, Checkbox, Typography, Tabs } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/system'
import { getAllArticles } from '@/apis/article'
import { getBlogArticleUrl } from '@/transforms/url'
import { Article, ArticleStatus } from '@/constants/article'
import { UniversalEditor, UnEditorLanguage } from '@/components/common/UniversalEditor'

export const ActionsForm: React.FC = () => {
  const databaseUpdating = useLoading()
  const archiveUpdating = useLoading()

  const updateDatabaseBackup = () => {
    Modal.confirm({
      centered: true,
      title: '更新备份会导致强制覆盖旧的数据库备份，确定要继续吗？',
      onOk: () => databaseUpdating.promise(api.updateDatabaseBackup())
    })
  }

  const updateArchiveCache = () => {
    Modal.confirm({
      centered: true,
      title: '将会更新全站的所有全量数据缓存，确定要继续吗？',
      onOk: () => archiveUpdating.promise(api.updateArchiveCache())
    })
  }

  const articlesData = useShallowRef<Article[]>([])
  const articlesLoading = useLoading()
  const articlesState = useReactive({
    modalOpened: false,
    publicOnly: true
  })

  const filteredArticles = useComputed(() => {
    if (articlesState.publicOnly) {
      return articlesData.value.filter((a) => a.status === ArticleStatus.Published)
    } else {
      return articlesData.value
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
          `${article.content}`
        ]
          .join('\n')
          .trim()
      })
      .join('\n\n-----\n\n')
  })

  const handleArticlesPublicOnlyChange = (value: boolean) => {
    articlesState.publicOnly = value
  }

  const openExportArticlesModal = async () => {
    articlesState.modalOpened = true
    articlesState.publicOnly = true
    articlesData.value = await articlesLoading.promise(getAllArticles())
  }

  const closeExportArticlesModal = () => {
    articlesState.modalOpened = false
    articlesData.value = []
  }

  return (
    <Row>
      <Button
        type="primary"
        block={true}
        loading={databaseUpdating.state.value}
        onClick={updateDatabaseBackup}
        icon={<Icons.CloudUploadOutlined />}
      >
        立即更新数据库备份
      </Button>
      <Divider />
      <Button
        type="primary"
        block={true}
        loading={archiveUpdating.state.value}
        onClick={updateArchiveCache}
        icon={<Icons.CloudSyncOutlined />}
      >
        更新 Archive 及缓存
      </Button>
      <Divider />
      <Button
        block={true}
        onClick={openExportArticlesModal}
        icon={<Icons.CloudDownloadOutlined />}
      >
        导出全量文章数据
      </Button>
      <Modal
        title="导出全量文章数据"
        width="80%"
        footer={null}
        maskClosable={false}
        loading={articlesLoading.state.value}
        open={articlesState.modalOpened}
        onCancel={closeExportArticlesModal}
      >
        <Divider />
        <Flex justify="space-between">
          <Checkbox
            checked={articlesState.publicOnly}
            onChange={(event) => handleArticlesPublicOnlyChange(event.target.checked)}
          >
            仅保留公开文章数据（ArticleStatus = Published）
          </Checkbox>
          <Typography.Text strong={articlesState.publicOnly} disabled={!articlesState.publicOnly}>
            已过滤 {articlesData.value.length - filteredArticles.value.length} 条非公开数据
          </Typography.Text>
        </Flex>
        <Divider />
        <Tabs
          size="middle"
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
              key: 'llm-friendly-markdown',
              icon: <Icons.OpenAIOutlined />,
              label: 'LLM 友好的 Markdown 格式数据',
              children: (
                <UniversalEditor
                  rows={24}
                  value={filteredArticlesMarkdown.value}
                  eid="app-all-articles-markdown"
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
      </Modal>
    </Row>
  )
}
