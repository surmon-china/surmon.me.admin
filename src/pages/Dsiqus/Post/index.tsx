/**
 * @file Disqts posts page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, onMounted, useRef, useWatch } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Divider, Flex, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { scrollTo } from '@/utils/scroller'
import { DisqusPostStatus } from '@/constants/disqus'
import { getDisqusConfig, getDisqusPosts, GeneralDisqusParams } from '@/apis/disqus'
import { ListFilters, DEFAULT_FILTER_PARAMS, SELECT_ALL_VALUE } from './ListFilters'
import { TableList } from './TableList'

export const DisqusPostsPage: React.FC = () => {
  const disqusConfig = useRef<any>(null)
  const fetching = useLoading()
  const posts = useShallowReactive({
    cursor: null as any,
    list: [] as any[]
  })

  // filters
  const threadIdInput = useRef('')
  const filterParams = useRef({ ...DEFAULT_FILTER_PARAMS })

  // https://disqus.com/api/docs/posts/list/
  const fetchList = (params?: GeneralDisqusParams) => {
    const getParams = {
      ...params,
      limit: 50,
      forum: disqusConfig.value!.forum,
      order: filterParams.value.order,
      thread: threadIdInput.value || null,
      include:
        filterParams.value.include !== SELECT_ALL_VALUE
          ? [filterParams.value.include]
          : [...Object.values(DisqusPostStatus)]
    }

    fetching.promise(getDisqusPosts(getParams)).then((response) => {
      if (params?.cursor) {
        posts.cursor = response.result.cursor
        posts.list.push(...response.result.response)
      } else {
        posts.cursor = response.result.cursor
        posts.list = response.result.response
        scrollTo(document.body)
      }
    })
  }

  const loadNextPage = () => {
    fetchList({ cursor: posts.cursor.next })
  }

  const resetFiltersToDefault = () => {
    threadIdInput.value = ''
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  useWatch(
    () => filterParams.value,
    () => fetchList(),
    { deep: true }
  )

  onMounted(() => {
    getDisqusConfig().then((response) => {
      disqusConfig.value = response.result
      fetchList()
    })
  })

  return (
    <Card
      title={`Posts (${posts.list.length})`}
      variant="borderless"
      extra={
        <Button
          type="primary"
          size="small"
          target="_blank"
          icon={<Icons.DashboardOutlined />}
          href={`https://${disqusConfig.value?.forum}.disqus.com/admin/moderate/all/`}
        >
          Disqus Moderate
        </Button>
      }
    >
      <ListFilters
        loading={fetching.state.value}
        threadId={threadIdInput.value}
        onThreadIdChange={(id) => (threadIdInput.value = id)}
        onThreadIdSearch={() => fetchList()}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        onResetRefresh={resetFiltersToDefault}
      />
      <Divider />
      <TableList loading={fetching.state.value} data={posts.list.slice()} />
      <br />
      <Flex justify="center">
        {posts.cursor?.hasNext ? (
          <Button
            size="large"
            disabled={fetching.state.value}
            loading={fetching.state.value}
            onClick={loadNextPage}
          >
            {fetching.state.value ? 'Loading...' : 'Loadmore'}
          </Button>
        ) : (
          <Typography.Text type="secondary">NO MORE</Typography.Text>
        )}
      </Flex>
    </Card>
  )
}
