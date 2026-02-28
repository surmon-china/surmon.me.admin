/**
 * @file Feedback page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, useRef, onMounted, useWatch, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { useTranslation } from '@/i18n'
import { Card, Divider, Modal, Drawer, Spin } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/feedback'
import type { GetFeedbacksParams } from '@/apis/feedback'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { ResponsePaginationData } from '@/constants/nodepress'
import { Feedback } from '@/constants/feedback'
import { scrollTo } from '@/utils/scroller'
import type { FilterParams } from './ListFilters'
import { ListFilters, DEFAULT_FILTER_PARAMS, getQueryParams } from './ListFilters'
import { TableList } from './TableList'
import { EditForm } from './EditForm'

export const FeedbackPage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const updating = useLoading()
  const feedbacks = useShallowReactive<ResponsePaginationData<Feedback>>({
    data: [],
    pagination: void 0
  })

  // filters
  const searchKeyword = useRef('')
  const filterParams = useRef<FilterParams>({ ...DEFAULT_FILTER_PARAMS })

  const resetFiltersToDefault = () => {
    searchKeyword.value = ''
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  // select
  const selectedIds = useRef<number[]>([])
  const selectedFeedbacks = useComputed(() => {
    return feedbacks.data.filter((c) => selectedIds.value.includes(c.id))
  })

  // edit drawer
  const isEditDrawerOpen = useRef(false)
  const activeEditItemIndex = useRef<number | null>(null)
  const activeEditFeedback = useComputed(() => {
    const index = activeEditItemIndex.value
    return index !== null ? feedbacks.data[index] : null
  })

  const closeEditDrawer = () => {
    isEditDrawerOpen.value = false
  }

  const openEditDrawer = (index: number) => {
    activeEditItemIndex.value = index
    isEditDrawerOpen.value = true
  }

  const fetchList = (params?: GetFeedbacksParams) => {
    const getParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(api.getFeedbacks(getParams)).then((response) => {
      feedbacks.data = response.data
      feedbacks.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: feedbacks.pagination?.current_page,
      per_page: feedbacks.pagination?.per_page
    })
  }

  const deleteItems = (feedbacks: Feedback[]) => {
    Modal.confirm({
      title: `确定要彻底删除 ${feedbacks.length} 个反馈吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () => {
        return api.deleteFeedbacks(feedbacks.map(({ id }) => id)).then(() => {
          refreshList()
        })
      }
    })
  }

  const updateItem = (feedback: Feedback) => {
    const { emotion_emoji, emotion_text, ...target } = {
      ...activeEditFeedback.value,
      ...feedback
    }
    const payload = {
      ...target,
      ip: target.ip || null
    }

    updating.promise(api.updateFeedback(payload)).then(() => {
      closeEditDrawer()
      refreshList()
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
      title={i18n.t('page.feedback.list.title', { total: feedbacks.pagination?.total ?? '-' })}
    >
      <ListFilters
        loading={fetching.state.value}
        keyword={searchKeyword.value}
        onKeywordChange={(keyword) => (searchKeyword.value = keyword)}
        onKeywordSearch={() => fetchList()}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        onResetRefresh={resetFiltersToDefault}
        extra={
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '彻底删除',
                icon: <Icons.DeleteOutlined />,
                onClick: () => deleteItems(selectedFeedbacks.value)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        data={feedbacks.data}
        pagination={feedbacks.pagination}
        selectedIds={selectedIds.value}
        onSelect={(ids) => (selectedIds.value = ids)}
        onDetail={(_, index) => openEditDrawer(index)}
        onDelete={(feedback) => deleteItems([feedback])}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
      />
      <Drawer
        size="large"
        title="反馈详情"
        destroyOnHidden={true}
        open={isEditDrawerOpen.value}
        onClose={closeEditDrawer}
      >
        <Spin spinning={updating.state.value}>
          {activeEditFeedback.value && (
            <EditForm
              submitting={updating.state.value}
              feedback={activeEditFeedback.value}
              onSubmit={(feedback) => updateItem(feedback)}
            />
          )}
        </Spin>
      </Drawer>
    </Card>
  )
}
