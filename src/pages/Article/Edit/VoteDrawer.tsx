import React from 'react'
import { useShallowRef, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Drawer, Flex, Space, List, Tag, Popover, Descriptions } from 'antd'
import { DrawerProps } from 'antd/lib/drawer'
import * as Icons from '@ant-design/icons'
import * as voteApi from '@/apis/vote'
import type { GetVotesParams } from '@/apis/vote'
import { SortSelect } from '@/components/common/SortSelect'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { Vote, VoteType, getVoteType, VoteTarget, getVoteAuthorTypeText } from '@/constants/vote'
import { Pagination } from '@/constants/nodepress'
import { SortOrder } from '@/constants/sort'
import { stringToYMD } from '@/transforms/date'
import { parseBrowser, parseOS } from '@/transforms/ua'

const renderVoteListItem = (vote: Vote) => {
  return (
    <Descriptions
      column={3}
      items={[
        {
          key: 'user',
          label: '用户',
          children: (
            <Space orientation="vertical">
              <Popover
                title="用户数据"
                placement="right"
                content={<pre>{JSON.stringify(vote.author, null, 2)}</pre>}
              >
                <span>
                  <UniversalText text={vote.author?.name} placeholder="未知用户" />（
                  {getVoteAuthorTypeText(vote.author_type)}）
                </span>
              </Popover>
            </Space>
          )
        },
        {
          key: 'tag',
          label: '操作',
          span: 2,
          children: (
            <Tag
              icon={getVoteType(vote.vote_type).icon}
              color={vote.vote_type === VoteType.Upvote ? 'green' : 'red'}
            >
              <strong>{getVoteType(vote.vote_type).name}</strong>
            </Tag>
          )
        },
        {
          key: 'browser',
          label: '浏览器',
          children: (
            <UniversalText text={parseBrowser(vote.user_agent!)} placeholder="未知浏览器" />
          )
        },
        {
          key: 'time',
          label: '时间',
          children: <UniversalText text={stringToYMD(vote.created_at!)} />
        },
        {
          key: 'os',
          label: '系统',
          children: <UniversalText text={parseOS(vote.user_agent!)} placeholder="未知系统" />
        },
        {
          key: 'location',
          label: '位置',
          children: <IPLocation data={vote.ip_location} />
        },
        {
          key: 'ip',
          label: 'IP',
          span: 2,
          children: <UniversalText text={vote.ip} copyable={true} placeholder="未知 IP" />
        }
      ]}
    />
  )
}

export interface VoteDrawerProps {
  size?: DrawerProps['size']
  open: boolean
  articleId: number
  likeCount: number
  onClose(): void
}

export const VoteDrawer: React.FC<VoteDrawerProps> = (props) => {
  const initFetching = useLoading()
  const loadmoreFetching = useLoading()
  const votes = useRef<Vote[]>([])
  const pagination = useShallowRef<Pagination | null>(null)
  const sortOrder = useShallowRef(SortOrder.Desc)

  const hasMore = useComputed(() => {
    if (!pagination.value) {
      return false
    } else {
      return pagination.value.current_page < pagination.value.total_page
    }
  })

  const fetchVotes = async (page = 1) => {
    const isFirstPage = page === 1
    const fetching = isFirstPage ? initFetching : loadmoreFetching
    // clean list
    if (isFirstPage) {
      votes.value = []
      pagination.value = null
    }

    const getParams: GetVotesParams = {
      page,
      per_page: 50,
      target_type: VoteTarget.Article,
      target_id: props.articleId,
      sort: sortOrder.value
    }
    const response = await fetching.promise(voteApi.getVotes(getParams))
    if (isFirstPage) {
      votes.value = response.data
      pagination.value = response.pagination!
    } else {
      votes.value.push(...response.data)
      pagination.value = response.pagination!
    }
  }

  onMounted(() => fetchVotes())

  return (
    <Drawer
      size={props.size}
      title={`文章获赞记录（${props.likeCount ?? '-'}）`}
      loading={initFetching.state.value}
      destroyOnHidden={true}
      open={props.open}
      onClose={props.onClose}
      extra={
        <Space.Compact>
          <SortSelect
            disabled={initFetching.state.value || loadmoreFetching.state.value}
            value={sortOrder.value}
            onChange={(value) => {
              sortOrder.value = value
              fetchVotes()
            }}
          />
          <Button
            icon={<Icons.ReloadOutlined />}
            disabled={loadmoreFetching.state.value}
            loading={initFetching.state.value}
            onClick={() => fetchVotes()}
          >
            刷新数据
          </Button>
        </Space.Compact>
      }
    >
      <List
        itemLayout="vertical"
        loading={loadmoreFetching.state.value}
        dataSource={votes.value}
        renderItem={(vote) => <List.Item>{renderVoteListItem(vote)}</List.Item>}
      />
      <br />
      <Flex justify="center">
        <Button
          style={{ width: 240 }}
          icon={<Icons.PlusOutlined />}
          loading={loadmoreFetching.state.value}
          disabled={!hasMore.value}
          onClick={() => fetchVotes(pagination.value?.current_page! + 1)}
        >
          {hasMore.value ? '加载更多' : '没有更多'}
        </Button>
      </Flex>
    </Drawer>
  )
}
