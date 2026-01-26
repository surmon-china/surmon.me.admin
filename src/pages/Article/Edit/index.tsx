/**
 * @file Article edit page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useParams, useNavigate } from 'react-router'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Modal, Button, Space, Divider, message, Typography, Tooltip } from 'antd'
import * as Icons from '@ant-design/icons'
import { RoutesKey, RoutesPath, RoutesPather } from '@/routes'
import { getUnEditorCache } from '@/components/common/UniversalEditor'
import * as api from '@/apis/article'
import { Article } from '@/constants/article'
import { scrollTo } from '@/utils/scroller'
import { numberToKilo, numberSplit } from '@/transforms/number'
import { getBlogArticleUrl } from '@/transforms/url'
import { stringToYMD } from '@/transforms/date'
import { ArticleEditor } from '../Editor'
import { VoteDrawer } from './VoteDrawer'
import { CommentDrawer } from './CommentDrawer'
import { CommentTreeList } from './CommentTreeList'

export const ArticleEditPage: React.FC = () => {
  const { article_id: articleId } = useParams<'article_id'>()
  const articleCacheId = RoutesPather.articleDetail(articleId!)
  const navigate = useNavigate()
  const fetching = useLoading()
  const updating = useLoading()
  const article = useRef<Article | null>(null)

  // drawers
  const isCommentDrawerOpen = useRef(false)
  const isVoteDrawerOpen = useRef(false)

  const initFetchArticleWithCache = async () => {
    try {
      const remoteArticle = await fetching.promise(api.getArticle(articleId!))
      const localContent = getUnEditorCache(articleCacheId)
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
    } catch (error: any) {
      Modal.error({
        centered: true,
        title: '文章请求失败',
        content: String(error.message)
      })
    }
  }

  const updateArticle = (_article: Article) => {
    return updating.promise(api.updateArticle(_article)).then((result) => {
      article.value = result
      scrollTo(document.body)
    })
  }

  const deleteArticle = () => {
    Modal.confirm({
      title: `你确定要彻底删除文章《${article!.value!.title}》吗？`,
      content: '该行为是物理删除，不可恢复！',
      okButtonProps: {
        danger: true,
        ghost: true
      },
      onOk: () => {
        return updating.promise(api.deleteArticles([article.value?._id!])).then(() => {
          navigate(RoutesPath[RoutesKey.ArticleList])
          scrollTo(document.body)
        })
      }
    })
  }

  const navigateToCommentList = () => {
    navigate({
      pathname: RoutesPath[RoutesKey.Comment],
      search: `post_id=${article.value?.id!}`
    })
  }

  onMounted(() => initFetchArticleWithCache())

  return (
    <>
      <ArticleEditor
        article={article.value}
        editorCacheId={articleCacheId}
        loading={fetching.state.value}
        submitting={updating.state.value}
        onSubmit={(_article) => updateArticle(_article)}
        mainFormExtraItems={[
          {
            label: 'ID',
            content: (
              <Space size="small">
                <Typography.Text>{article.value?.id ?? '-'}</Typography.Text>
                <Divider orientation="vertical" />
                <Typography.Text>{article.value?._id ?? '-'}</Typography.Text>
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
            <Tooltip title={getBlogArticleUrl(article.value?.id!)}>
              <Button
                size="small"
                type="dashed"
                target="_blank"
                icon={<Icons.ExportOutlined />}
                loading={fetching.state.value}
                disabled={fetching.state.value}
                href={getBlogArticleUrl(article.value?.id!)}
              >
                打开
              </Button>
            </Tooltip>
            <Divider orientation="vertical" />
            <Button
              type="dashed"
              size="small"
              danger={true}
              icon={<Icons.DeleteOutlined />}
              disabled={fetching.state.value}
              onClick={() => message.warning('双击执行删除操作')}
              onDoubleClick={deleteArticle}
            >
              删除文章
            </Button>
          </Space>
        }
      />
      {article.value && (
        <>
          <VoteDrawer
            size="large"
            open={isVoteDrawerOpen.value}
            likeCount={article.value.stats!.likes}
            articleId={article.value.id!}
            onClose={() => (isVoteDrawerOpen.value = false)}
          />
          <CommentDrawer
            size="large"
            open={isCommentDrawerOpen.value}
            commentCount={article.value.stats!.comments}
            articleId={article.value.id!}
            renderTreeList={({ comments, loading }) => (
              <CommentTreeList comments={comments} loading={loading} />
            )}
            onClose={() => (isCommentDrawerOpen.value = false)}
            onNavigate={navigateToCommentList}
          />
        </>
      )}
    </>
  )
}
