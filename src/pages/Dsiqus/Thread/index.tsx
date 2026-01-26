/**
 * @file Disqus threads page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { onMounted, useShallowReactive, useRef, useWatch } from 'veact'
import { useLoading } from 'veact-use'
import * as Icons from '@ant-design/icons'
import { Button, Card, Table, Select, Tag, Space, Switch, Divider, Flex, Typography } from 'antd'
import { getDisqusConfig, getDisqusThreads, GeneralDisqusParams } from '@/apis/disqus'
import { DisqusThreadStatus, DisqusSortOrder } from '@/constants/disqus'
import { stringToYMD } from '@/transforms/date'
import { scrollTo } from '@/utils/scroller'

const SELECT_ALL_VALUE = 'ALL'
const DEFAULT_FILTER_PARAMS = {
  order: DisqusSortOrder.Desc,
  include: SELECT_ALL_VALUE as any as DisqusThreadStatus | typeof SELECT_ALL_VALUE
}

export const DisqusThreadsPage: React.FC = () => {
  const disqusConfig = useRef<any>(null)
  const fetching = useLoading()
  const threads = useShallowReactive({
    cursor: null as any,
    list: [] as any[]
  })

  // https://disqus.com/api/docs/threads/list/
  const filterParams = useRef({ ...DEFAULT_FILTER_PARAMS })
  const resetFilterParams = () => {
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  const fetchList = (params?: GeneralDisqusParams) => {
    const getParams = {
      ...params,
      limit: 50,
      forum: disqusConfig.value.forum,
      order: filterParams.value.order,
      include:
        filterParams.value.include !== SELECT_ALL_VALUE
          ? [filterParams.value.include]
          : [...Object.values(DisqusThreadStatus)]
    }

    fetching.promise(getDisqusThreads(getParams)).then((response) => {
      if (params?.cursor) {
        threads.cursor = response.result.cursor
        threads.list.push(...response.result.response)
      } else {
        threads.cursor = response.result.cursor
        threads.list = response.result.response
        scrollTo(document.body)
      }
    })
  }

  const loadNextPage = () => {
    fetchList({ cursor: threads.cursor.next })
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
      variant="borderless"
      title={`Threads (${threads.list.length})`}
      extra={
        <Button
          type="primary"
          size="small"
          target="_blank"
          icon={<Icons.DashboardOutlined />}
          href={`https://${disqusConfig.value?.forum}.disqus.com/admin/discussions/`}
        >
          Disqus Discussions
        </Button>
      }
    >
      <Space wrap>
        <Select
          style={{ width: 110 }}
          disabled={fetching.state.value}
          value={filterParams.value.include}
          onChange={(state) => (filterParams.value.include = state)}
          options={[
            {
              value: SELECT_ALL_VALUE,
              label: 'All state'
            },
            {
              value: DisqusThreadStatus.Open,
              label: 'Open'
            },
            {
              value: DisqusThreadStatus.Closed,
              label: 'Closed'
            }
          ]}
        />
        <Select
          style={{ width: 80 }}
          disabled={fetching.state.value}
          value={filterParams.value.order}
          onChange={(order) => (filterParams.value.order = order)}
          options={[
            {
              value: DisqusSortOrder.Desc,
              label: 'Desc'
            },
            {
              value: DisqusSortOrder.Asc,
              label: 'Asc'
            }
          ]}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={fetching.state.value}
          onClick={() => resetFilterParams()}
        >
          Reset and refresh
        </Button>
      </Space>
      <Divider />
      <Table
        rowKey="id"
        dataSource={threads.list.slice()}
        pagination={false}
        loading={fetching.state.value}
        columns={[
          {
            title: 'Title / Link',
            key: 'title',
            render: (_, item) => {
              return (
                <Space orientation="vertical">
                  <Typography.Link
                    href={`https://disqus.com/home/discussion/${item.forum}/${item.slug}/`}
                    target="_blank"
                    strong
                  >
                    {item.title}
                  </Typography.Link>
                  <Typography.Link href={item.link} target="_blank" type="secondary">
                    {item.link}
                  </Typography.Link>
                </Space>
              )
            }
          },
          {
            title: 'ID / Author',
            key: 'id',
            render: (_, item) => (
              <Space orientation="vertical">
                <Typography.Text copyable={true}>{item.id}</Typography.Text>
                <Typography.Text copyable={true} type="secondary">
                  {item.author}
                </Typography.Text>
              </Space>
            )
          },
          {
            title: 'Identifiers / Time',
            key: 'identifiers',
            render: (_, item) => (
              <Space orientation="vertical">
                <Space>
                  {item.identifiers.map((i: any) => (
                    <Tag key={i}>{i}</Tag>
                  ))}
                </Space>
                <Typography.Text type="secondary">{stringToYMD(item.createdAt)}</Typography.Text>
              </Space>
            )
          },
          {
            title: 'Posts',
            dataIndex: 'posts',
            render: (_, item) => (
              <Space size="small">
                <Icons.CommentOutlined />
                {item.posts}
              </Space>
            )
          },
          {
            title: 'Likes',
            key: 'likes',
            render: (_, item) => (
              <Space size="small">
                <Icons.LikeOutlined />
                {item.likes}
              </Space>
            )
          },
          {
            title: 'Dislikes',
            key: 'dislikes',
            render: (_, item) => (
              <Space size="small">
                <Icons.DislikeOutlined />
                {item.dislikes}
              </Space>
            )
          },
          {
            title: 'Score',
            dataIndex: 'userScore'
          },
          {
            title: 'State',
            dataIndex: 'isClosed',
            render: (_, item) => (
              <Switch
                disabled={true}
                checked={!item.isClosed}
                checkedChildren="Open"
                unCheckedChildren="Closed"
              />
            )
          }
        ]}
      />
      <br />
      <Flex justify="center">
        {threads.cursor?.hasNext ? (
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
