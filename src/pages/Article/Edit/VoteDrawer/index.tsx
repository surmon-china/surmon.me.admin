import React from 'react'
import { useShallowRef, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Drawer, Flex, Space, List, Tag, Descriptions } from 'antd'
import { DrawerProps } from 'antd/lib/drawer'
import * as Icons from '@ant-design/icons'
import * as voteApi from '@/apis/vote'
import type { GetVotesParams } from '@/apis/vote'
import { SortSelect } from '@/components/common/SortSelect'
import { IPLocation } from '@/components/common/IPLocation'
import { UserAgent } from '@/components/common/UserAgent'
import { AuthorName } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import { Vote, VoteType, getVoteType, VoteTargetType } from '@/constants/vote'
import { Pagination } from '@/constants/nodepress'
import { SortOrder } from '@/constants/sort'
import { stringToYMD } from '@/transforms/date'

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
      target_type: VoteTargetType.Article,
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
        renderItem={(vote) => (
          <List.Item>
            <Descriptions
              column={3}
              items={[
                {
                  key: 'author',
                  label: '作者',
                  children: (
                    <AuthorName
                      user={vote.user}
                      author_type={vote.author_type}
                      author_name={vote.author_name}
                      tooltip={true}
                    />
                  )
                },
                {
                  key: 'tag',
                  label: '操作',
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
                  key: 'time',
                  label: '时间',
                  children: <UniversalText text={stringToYMD(vote.created_at!)} />
                },
                {
                  key: 'location',
                  label: '位置',
                  children: <IPLocation ipLocation={vote.ip_location} emoji={true} />
                },
                {
                  key: 'browser',
                  label: '设备',
                  children: <UserAgent.OverView userAgent={vote.user_agent} />
                }
              ]}
            />
          </List.Item>
        )}
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
