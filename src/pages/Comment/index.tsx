/**
 * @file Comment page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import queryString from 'query-string'
import _uniq from 'lodash/uniq'
import { useLocation } from 'react-router'
import { useShallowReactive, useRef, onMounted, useWatch, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Card, Divider, Modal, Drawer, Spin, Button, message } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/comment'
import type { GetCommentsParams } from '@/apis/comment'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { Comment as CommentType, CommentStatus, CommentTargetType } from '@/constants/comment'
import { getCommentStatus } from '@/constants/comment'
import { ResponsePaginationData } from '@/constants/nodepress'
import { getBlogGuestbookUrl } from '@/transforms/url'
import { scrollTo } from '@/utils/scroller'
import { useTranslation } from '@/i18n'
import { ListFilters, DEFAULT_FILTER_PARAMS, getQueryParams } from './ListFilters'
import { TableList } from './TableList'
import { EditForm } from './EditForm'
import { ClaimUserSelector } from './ClaimUserSelector'

export const CommentPage: React.FC = () => {
  const location = useLocation()
  const { i18n } = useTranslation()
  const { target_type, target_id } = queryString.parse(location.search)
  const targetIdParam = target_id ? Number(target_id) : void 0

  // comments
  const fetching = useLoading()
  const updating = useLoading()
  const comments = useShallowReactive<ResponsePaginationData<CommentType>>({
    data: [],
    pagination: void 0
  })

  // filters
  const searchKeyword = useRef('')
  const filterTargetIdInput = useRef(String(targetIdParam ?? ''))
  const filterParams = useRef({
    ...DEFAULT_FILTER_PARAMS,
    target_type: (target_type as any) ?? DEFAULT_FILTER_PARAMS.target_type,
    target_id: targetIdParam ?? DEFAULT_FILTER_PARAMS.target_id
  })

  const resetFiltersToDefault = () => {
    searchKeyword.value = ''
    filterTargetIdInput.value = ''
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  const resetFiltersToPostId = (targetType: CommentTargetType, targetId: number) => {
    searchKeyword.value = ''
    filterTargetIdInput.value = String(targetId)
    filterParams.value = {
      ...DEFAULT_FILTER_PARAMS,
      target_type: targetType,
      target_id: Number(targetId)
    }
  }

  // select
  const selectedIds = useRef<number[]>([])
  const selectedComments = useComputed(() => {
    return comments.data.filter((comment) => selectedIds.value.includes(comment.id))
  })

  // drawer
  const isEditDrawerOpen = useRef(false)
  const activeEditCommentIndex = useRef<number | null>(null)
  const activeEditComment = useComputed(() => {
    const index = activeEditCommentIndex.value
    return index !== null ? comments.data[index] : null
  })

  const closeEditDrawer = () => {
    isEditDrawerOpen.value = false
  }

  const openEditDrawer = (index: number) => {
    activeEditCommentIndex.value = index
    isEditDrawerOpen.value = true
  }

  const fetchList = (params?: GetCommentsParams) => {
    const getParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(api.getComments(getParams)).then((response) => {
      comments.data = response.data
      comments.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: comments.pagination?.current_page,
      per_page: comments.pagination?.per_page
    })
  }

  const updateComment = (comment: CommentType) => {
    const payload = {
      ...activeEditComment.value,
      ...comment
    }

    updating.promise(api.updateComment(payload)).then(() => {
      closeEditDrawer()
      refreshList()
    })
  }

  const deleteComments = (comments: CommentType[]) => {
    Modal.confirm({
      title: `确定要彻底删除 ${comments.length} 个评论吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () => {
        return api.deleteComments(comments.map((comment) => comment.id)).then(() => {
          refreshList()
        })
      }
    })
  }

  const updateCommentsStatus = (comments: CommentType[], status: CommentStatus) => {
    Modal.confirm({
      title: `确定要将 ${comments.length} 个评论更新为「${getCommentStatus(status).name}」状态吗？`,
      content: '请谨慎操作',
      centered: true,
      onOk: () => {
        return api
          .updateCommentsStatus(
            comments.map((comment) => comment.id),
            status
          )
          .then(() => {
            refreshList()
          })
      }
    })
  }

  const claimCommentsUser = (comments: CommentType[]) => {
    let selectedUserId: number | null = null
    Modal.confirm({
      title: '认领评论',
      width: 680,
      centered: true,
      content: <ClaimUserSelector comments={comments} onChange={(id) => (selectedUserId = id)} />,
      okText: '确认认领',
      onOk: () => {
        if (!selectedUserId) {
          message.warning('请先搜索并选择目标用户')
          return Promise.reject()
        }

        return api
          .claimCommentsUser(
            comments.map((comment) => comment.id),
            selectedUserId
          )
          .then((result) => {
            if (result.modifiedCount === comments.length) {
              message.success(`${comments.length} 个评论全部认领成功`)
            } else if (result.modifiedCount === 0) {
              message.error(`${comments.length} 个评论全部认领失败！`)
            } else {
              message.warning(
                `部分认领成功！成功：${result.modifiedCount}，失败：${comments.length - result.modifiedCount}`
              )
            }
            refreshList()
          })
      }
    })
  }

  useWatch(
    () => filterParams.value,
    () => fetchList(),
    { deep: true }
  )

  onMounted(() => {
    fetchList()
  })

  return (
    <Card
      variant="borderless"
      title={i18n.t('page.comment.list.title', { total: comments.pagination?.total ?? '-' })}
      extra={
        <Button
          type="primary"
          size="small"
          target="_blank"
          icon={<Icons.RocketOutlined />}
          href={getBlogGuestbookUrl()}
        >
          去留言板
        </Button>
      }
    >
      <ListFilters
        loading={fetching.state.value}
        keyword={searchKeyword.value}
        onKeywordChange={(value) => (searchKeyword.value = value)}
        onKeywordSearch={() => fetchList()}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        targetIdInput={filterTargetIdInput.value}
        onTargetIdInputChange={(value) => (filterTargetIdInput.value = value)}
        onResetRefresh={resetFiltersToDefault}
        extra={
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '用户认领',
                icon: <Icons.UserSwitchOutlined />,
                onClick: () => claimCommentsUser(selectedComments.value)
              },
              {
                type: 'divider'
              },
              {
                label: '退为草稿',
                icon: <Icons.EditOutlined />,
                onClick: () => updateCommentsStatus(selectedComments.value, CommentStatus.Pending)
              },
              {
                label: '审核通过',
                icon: <Icons.CheckOutlined />,
                onClick: () =>
                  updateCommentsStatus(selectedComments.value, CommentStatus.Published)
              },
              {
                label: '标为垃圾',
                icon: <Icons.StopOutlined />,
                onClick: () => updateCommentsStatus(selectedComments.value, CommentStatus.Spam)
              },
              {
                label: '移回收站',
                icon: <Icons.DeleteOutlined />,
                onClick: () => updateCommentsStatus(selectedComments.value, CommentStatus.Trash)
              },
              {
                label: '彻底删除',
                icon: <Icons.DeleteOutlined />,
                onClick: () => deleteComments(selectedComments.value)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        selectedIds={selectedIds.value}
        onSelecte={(ids) => (selectedIds.value = ids)}
        data={comments.data}
        pagination={comments.pagination}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
        onDetail={(_, index) => openEditDrawer(index)}
        onDelete={(comment) => deleteComments([comment])}
        onUpdateStatus={(comment, status) => updateCommentsStatus([comment], status)}
        onGoToTarget={resetFiltersToPostId}
      />
      <Drawer
        size="large"
        title="评论详情"
        destroyOnHidden={true}
        open={isEditDrawerOpen.value}
        onClose={closeEditDrawer}
      >
        <Spin spinning={updating.state.value}>
          {activeEditComment.value && (
            <EditForm
              submitting={updating.state.value}
              comment={activeEditComment.value}
              onSubmit={(comment) => updateComment(comment)}
            />
          )}
        </Spin>
      </Drawer>
    </Card>
  )
}
