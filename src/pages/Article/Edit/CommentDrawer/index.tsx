import React from 'react'
import { useShallowRef, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Divider, Drawer, Flex, Space, List } from 'antd'
import { DrawerProps } from 'antd/lib/drawer'
import * as Icons from '@ant-design/icons'
import * as commentApi from '@/apis/comment'
import { SortSelect } from '@/components/common/SortSelect'
import type { GetCommentsParams } from '@/apis/comment'
import { Comment, CommentTargetType } from '@/constants/comment'
import { Pagination } from '@/constants/nodepress'
import { SortMode } from '@/constants/sort'
import { transformCommentListToTree } from './tree'
import { CommentItem } from './CommentItem'

export interface CommentDrawerProps {
  size?: DrawerProps['size']
  open: boolean
  articleId: number
  commentCount: number
  onClose(): void
  onNavigate(): void
}

export const CommentDrawer: React.FC<CommentDrawerProps> = (props) => {
  const initFetching = useLoading()
  const loadmoreFetching = useLoading()
  const comments = useRef<Comment[]>([])
  const pagination = useShallowRef<Pagination | null>(null)
  const sortMode = useShallowRef(SortMode.Latest)
  const commentTreeList = useComputed(() => transformCommentListToTree(comments.value))

  const hasMore = useComputed(() => {
    if (!pagination.value) {
      return false
    } else {
      return pagination.value.current_page < pagination.value.total_page
    }
  })

  const fetchComments = async (page = 1) => {
    const isFirstPage = page === 1
    const fetching = isFirstPage ? initFetching : loadmoreFetching
    // clean list
    if (isFirstPage) {
      comments.value = []
      pagination.value = null
    }

    const getParams: GetCommentsParams = {
      page,
      per_page: 50,
      target_type: CommentTargetType.Article,
      target_id: props.articleId,
      sort: sortMode.value
    }
    const response = await fetching.promise(commentApi.getComments(getParams))
    if (isFirstPage) {
      comments.value = response.data
      pagination.value = response.pagination!
    } else {
      comments.value.push(...response.data)
      pagination.value = response.pagination!
    }
  }

  onMounted(() => fetchComments())

  return (
    <Drawer
      size={props.size}
      title={`文章评论（${props.commentCount ?? '-'}）`}
      loading={initFetching.state.value}
      destroyOnHidden={true}
      open={props.open}
      onClose={props.onClose}
      extra={
        <Space.Compact>
          <Button
            color="default"
            variant="dashed"
            icon={<Icons.ExportOutlined />}
            onClick={props.onNavigate}
          >
            管理全部评论
          </Button>
          <SortSelect
            withHot={true}
            disabled={initFetching.state.value || loadmoreFetching.state.value}
            value={sortMode.value}
            onChange={(value) => {
              sortMode.value = value
              fetchComments()
            }}
          />
          <Button
            icon={<Icons.ReloadOutlined />}
            disabled={loadmoreFetching.state.value}
            loading={initFetching.state.value}
            onClick={() => fetchComments()}
          >
            刷新数据
          </Button>
        </Space.Compact>
      }
    >
      <List
        itemLayout="vertical"
        loading={loadmoreFetching.state.value}
        dataSource={commentTreeList.value}
        renderItem={(rootComment) => (
          <List.Item>
            <CommentItem comment={rootComment}>
              {rootComment.children && rootComment.children.length > 0 && (
                <List
                  itemLayout="vertical"
                  dataSource={rootComment.children}
                  split={true}
                  renderItem={(replyComment) => (
                    <List.Item>
                      <CommentItem comment={replyComment} isReply={true} />
                    </List.Item>
                  )}
                />
              )}
            </CommentItem>
          </List.Item>
        )}
      />
      <Divider />
      <Flex justify="center">
        <Button
          style={{ width: 240 }}
          icon={<Icons.PlusOutlined />}
          loading={loadmoreFetching.state.value}
          disabled={!hasMore.value}
          onClick={() => fetchComments(pagination.value?.current_page! + 1)}
        >
          {hasMore.value ? '加载更多' : '没有更多'}
        </Button>
      </Flex>
    </Drawer>
  )
}
