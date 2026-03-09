/**
 * @file Ai Agent chat page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowRef, useRef, useComputed, useWatch, onMounted, useReactive } from 'veact'
import { useLoading } from 'veact-use'
import { useTranslation } from '@/i18n'
import { Card, Divider, Drawer, Button, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/ai-agent'
import type { ChatSession } from '@/constants/ai-agent'
import type { FilterParams } from './ListFilters'
import { ListFilters, DEFAULT_FILTER_PARAMS, getQueryParams } from './ListFilters'
import { TableList } from './TableList'
import { SessionDetail } from './Detail'
import { scrollTo } from '@/utils/scroller'

export const AiAgentPage: React.FC = () => {
  const { i18n } = useTranslation()

  // list
  const fetching = useLoading()
  const sessions = useShallowRef<ChatSession[]>([])
  const pagination = useReactive({
    pageSize: 50,
    currentPage: 1,
    hasMore: true
  })

  // filters
  const filterParams = useRef<FilterParams>({ ...DEFAULT_FILTER_PARAMS })
  const resetFiltersToDefault = () => {
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  // detail drawer
  const isDetailDrawerOpen = useRef(false)
  const activeSessionItemIndex = useRef<number | null>(null)
  const activeSessionItem = useComputed(() => {
    const index = activeSessionItemIndex.value
    return index !== null ? sessions.value[index] : null
  })

  const closeDetailDrawer = () => {
    isDetailDrawerOpen.value = false
  }

  const openDetailDrawer = (index: number) => {
    activeSessionItemIndex.value = index
    isDetailDrawerOpen.value = true
  }

  const fetchFirstPage = async () => {
    const result = await fetching.promise(
      api.getChatSessions({
        page: 1,
        page_size: pagination.pageSize,
        ...getQueryParams(filterParams.value)
      })
    )
    sessions.value = result
    pagination.currentPage = 1
    pagination.hasMore = result.length >= pagination.pageSize
    scrollTo(document.body)
  }

  const fetchNextPage = async () => {
    if (fetching.state.value) return
    const nextPage = pagination.currentPage + 1
    const result = await fetching.promise(
      api.getChatSessions({
        page: nextPage,
        page_size: pagination.pageSize,
        ...getQueryParams(filterParams.value)
      })
    )
    sessions.value = [...sessions.value, ...result]
    pagination.currentPage = nextPage
    pagination.hasMore = result.length >= pagination.pageSize
  }

  useWatch(
    () => filterParams.value,
    () => fetchFirstPage(),
    { deep: true }
  )

  onMounted(() => {
    fetchFirstPage()
  })

  return (
    <Card
      variant="borderless"
      title={i18n.t('page.ai-agent.list.title', { total: sessions.value.length ?? '-' })}
    >
      <ListFilters
        loading={fetching.state.value}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        onResetRefresh={resetFiltersToDefault}
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        data={sessions.value}
        footer={
          <Flex justify="center">
            <Button
              loading={fetching.state.value}
              disabled={!pagination.hasMore}
              onClick={fetchNextPage}
              icon={<Icons.PlusOutlined />}
            >
              Load More
            </Button>
          </Flex>
        }
        onDetail={(_, index) => openDetailDrawer(index)}
      />
      <Drawer
        size="large"
        title="对话详情"
        destroyOnHidden={true}
        open={isDetailDrawerOpen.value}
        onClose={closeDetailDrawer}
      >
        {activeSessionItem.value && <SessionDetail session={activeSessionItem.value} />}
      </Drawer>
    </Card>
  )
}
