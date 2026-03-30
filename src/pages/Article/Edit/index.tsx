/**
 * @file Article edit page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { useRef, onMounted, toRaw } from 'veact'
import { useLoading } from 'veact-use'
import { Modal, Button, Space, Divider, Typography, Tooltip, message } from 'antd'
import * as Icons from '@ant-design/icons'
import { RoutesKey, getRoutePath } from '@/routes'
import { getUnEditorCache } from '@/components/common/UniversalEditor'
import * as aiApis from '@/apis/ai'
import * as articleApis from '@/apis/article'
import { Article } from '@/constants/article'
import { scrollToTop } from '@/utils/scroll'
import { numberToKilo, numberSplit } from '@/transforms/number'
import { getBlogArticleUrl } from '@/transforms/url'
import { stringToYMD } from '@/transforms/date'
import { ArticleEditor } from '../Editor'
import { VoteDrawer } from './VoteDrawer'
import { CommentDrawer } from './CommentDrawer'
import { AiGeneratorModal } from './AiGeneratorModal'

export const ArticleEditPage: React.FC = () => {
  const { article_id } = useParams<'article_id'>()
  const articleId = Number(article_id)
  const articleCacheId = `article-${articleId}`
  const navigate = useNavigate()
  const fetching = useLoading()
  const updating = useLoading()
  const article = useRef<Article | null>(null)

  // drawers
  const isCommentDrawerOpen = useRef(false)
  const isVoteDrawerOpen = useRef(false)

  // AI generate
  const isAiReviewModalOpen = useRef(false)
  const isAiSummaryModalOpen = useRef(false)

  const closeAiModal = () => {
    isAiReviewModalOpen.value = false
    isAiSummaryModalOpen.value = false
  }

  const initFetchArticleWithCache = async () => {
    const remoteArticle = await fetching.promise(articleApis.getArticleDetail(articleId!))
    const localContent = await getUnEditorCache(articleCacheId)
    if (!!localContent && localContent !== remoteArticle.content) {
      Modal.confirm({
        title: '本地缓存存在未保存的文章，是否要覆盖远程数据？',
        content: '如果覆盖错了，刷新一次就可重新选择',
        okText: '本地覆盖远程',
        cancelText: '使用远程数据',
        centered: true,
        okButtonProps: {
          danger: true
        },
        onOk() {
          article.value = { ...remoteArticle, content: localContent || '' }
        },
        onCancel() {
          article.value = remoteArticle
        }
      })
    } else {
      article.value = remoteArticle
    }
  }

  const updateArticle = (_article: Article) => {
    return updating.promise(articleApis.updateArticle(_article)).then((result) => {
      article.value = result
      scrollToTop()
    })
  }

  const deleteArticle = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章《${article!.value!.title}》吗？`,
      content: <Typography.Text type="danger">该行为是物理删除，不可恢复！</Typography.Text>,
      centered: true,
      okButtonProps: {
        danger: true,
        ghost: true
      },
      onOk: () => {
        return updating.promise(articleApis.deleteArticle(article.value!.id)).then(() => {
          navigate(getRoutePath(RoutesKey.ArticleList))
          scrollToTop()
        })
      }
    })
  }

  const navigateToCommentList = () => {
    navigate({
      pathname: getRoutePath(RoutesKey.Comment),
      search: `target_type=article&target_id=${article.value?.id!}`
    })
  }

  const setAiContentToExtras = (aiExtras: Record<string, string>) => {
    const _article = toRaw(article.value)
    if (_article) {
      const newExtras = [...(_article.extras || [])]
      Object.entries(aiExtras).forEach(([key, value]) => {
        const targetIndex = newExtras.findIndex((item) => item.key === key)
        if (targetIndex > -1) {
          newExtras[targetIndex].value = value
        } else {
          newExtras.push({ key, value })
        }
      })

      article.value = { ..._article, extras: newExtras }
      message.success('AI 内容应用成功，请保存文章')
      closeAiModal()
    }
  }

  onMounted(() => {
    if (!/^[1-9]\d*$/.test(article_id!)) {
      Modal.error({
        centered: true,
        title: '不合法的 Article ID',
        content: `Invalid Article ID: ${article_id}`
      })
    } else {
      initFetchArticleWithCache().catch((error) => {
        Modal.error({
          centered: true,
          title: '文章请求失败',
          content: String(error.message)
        })
      })
    }
  })

  return (
    <>
      <ArticleEditor
        article={article.value}
        editorCacheId={articleCacheId}
        loading={fetching.state.value}
        submitting={updating.state.value}
        onSubmit={(_article) => updateArticle(_article)}
        onDelete={deleteArticle}
        mainFormExtraItems={[
          {
            label: 'ID',
            content: (
              <Space size="small">
                <Typography.Text>{article.value?.id ?? '-'}</Typography.Text>
                <Divider orientation="vertical" />
                <Typography.Text type="secondary">{article.value?._id ?? '-'}</Typography.Text>
              </Space>
            )
          },
          {
            label: '时间',
            content: (
              <Space size="small">
                最初发布于
                <Typography.Text>{stringToYMD(article.value?.created_at ?? '-')}</Typography.Text>
                <Divider orientation="vertical" />
                最后更新于
                <Typography.Text>{stringToYMD(article.value?.updated_at ?? '-')}</Typography.Text>
              </Space>
            )
          }
        ]}
        mainCardExtra={
          <Space size="small" wrap>
            <Space.Compact size="small">
              <Tooltip title={numberSplit(article.value?.stats?.views ?? 0)}>
                <Button icon={<Icons.EyeOutlined />} loading={fetching.state.value}>
                  {numberToKilo(article.value?.stats?.views ?? 0)} 阅读
                </Button>
              </Tooltip>
              <Button
                icon={<Icons.HeartOutlined />}
                loading={fetching.state.value}
                disabled={fetching.state.value}
                onClick={() => (isVoteDrawerOpen.value = true)}
              >
                {article.value?.stats?.likes ?? ''} 喜欢
              </Button>
              <Button
                icon={<Icons.CommentOutlined />}
                disabled={fetching.state.value}
                loading={fetching.state.value}
                onClick={() => (isCommentDrawerOpen.value = true)}
              >
                {article.value?.stats?.comments ?? ''} 评论
              </Button>
            </Space.Compact>
            <Divider orientation="vertical" />
            <Space.Compact>
              <Button
                size="small"
                color="primary"
                variant="dashed"
                loading={fetching.state.value}
                disabled={fetching.state.value}
                onClick={() => (isAiSummaryModalOpen.value = true)}
              >
                AI 摘要
              </Button>
              <Button
                size="small"
                color="primary"
                variant="dashed"
                loading={fetching.state.value}
                disabled={fetching.state.value}
                onClick={() => (isAiReviewModalOpen.value = true)}
              >
                AI 点评
              </Button>
            </Space.Compact>
            <Divider orientation="vertical" />
            <Tooltip title={getBlogArticleUrl(article.value?.id!)}>
              <Button
                size="small"
                type="dashed"
                target="_blank"
                color="primary"
                icon={<Icons.ExportOutlined />}
                loading={fetching.state.value}
                disabled={fetching.state.value}
                href={getBlogArticleUrl(article.value?.id!)}
              >
                打开
              </Button>
            </Tooltip>
          </Space>
        }
      />
      {article.value && (
        <>
          <VoteDrawer
            size="large"
            open={isVoteDrawerOpen.value}
            likeCount={article.value.stats!.likes}
            articleId={article.value.id}
            onClose={() => (isVoteDrawerOpen.value = false)}
          />
          <CommentDrawer
            size="large"
            open={isCommentDrawerOpen.value}
            commentCount={article.value.stats!.comments}
            articleId={article.value.id}
            onClose={() => (isCommentDrawerOpen.value = false)}
            onNavigate={navigateToCommentList}
          />
          <AiGeneratorModal
            title="AI 生成文章点评"
            open={isAiReviewModalOpen.value}
            articleId={article.value.id}
            onCancel={closeAiModal}
            onApply={setAiContentToExtras}
            generator={{
              type: 'article_review',
              generate: aiApis.generateArticleReview
            }}
          />
          <AiGeneratorModal
            title="AI 生成文章摘要"
            open={isAiSummaryModalOpen.value}
            articleId={article.value.id}
            onCancel={closeAiModal}
            onApply={setAiContentToExtras}
            generator={{
              type: 'article_summary',
              generate: aiApis.generateArticleSummary
            }}
          />
        </>
      )}
    </>
  )
}
