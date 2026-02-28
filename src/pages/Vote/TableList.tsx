import React from 'react'
import { Tag, Table, Typography, Popover, Space } from 'antd'
import { AuthorAvatar, AuthorName } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { UserAgent } from '@/components/common/UserAgent'
import { Pagination } from '@/constants/nodepress'
import { stringToYMD } from '@/transforms/date'
import { Vote, VoteType, getVoteType, getVoteTargetText } from '@/constants/vote'
import { APP_PAGE_SIZE_OPTIONS } from '@/config'

export interface TableListProps {
  loading: boolean
  data: Vote[]
  pagination: Pagination
  selectedIds: number[]
  onSelecte(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onClickTarget(vote: Vote): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Vote>
      rowKey="id"
      tableLayout="auto"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelecte
      }}
      pagination={{
        pageSizeOptions: APP_PAGE_SIZE_OPTIONS,
        current: props.pagination?.current_page,
        pageSize: props.pagination?.per_page,
        total: props.pagination?.total,
        showSizeChanger: true,
        onChange: props.onPaginate
      }}
      columns={[
        {
          title: 'ID',
          width: 40,
          dataIndex: 'id'
        },
        {
          title: '目标',
          width: 120,
          ellipsis: true,
          dataIndex: 'target_type',
          render: (_, vote) => (
            <Typography.Link onClick={() => props.onClickTarget(vote)}>
              {getVoteTargetText(vote.target_type)} #{vote.target_id}
            </Typography.Link>
          )
        },
        {
          title: '态度',
          ellipsis: true,
          dataIndex: 'vote_type',
          render: (_, vote) => (
            <Tag
              variant="outlined"
              icon={getVoteType(vote.vote_type).icon}
              color={vote.vote_type === VoteType.Upvote ? 'green' : 'red'}
            >
              <strong>{getVoteType(vote.vote_type).name}</strong>
            </Tag>
          )
        },
        {
          title: '作者',
          ellipsis: true,
          dataIndex: 'author_type',
          render: (_, vote) => (
            <Space>
              <AuthorAvatar
                user={vote.user}
                author_type={vote.author_type}
                author_name={vote.author_name}
                author_email={vote.author_email}
                tooltip={false}
                badge={true}
                size={28}
              />
              <AuthorName
                user={vote.user}
                author_type={vote.author_type}
                author_name={vote.author_name}
                tooltip={true}
              />
            </Space>
          )
        },
        {
          title: '时间',
          ellipsis: true,
          dataIndex: 'created_at',
          render(_, vote) {
            return <UniversalText text={stringToYMD(vote.created_at)} />
          }
        },
        {
          title: 'IP 位置',
          ellipsis: true,
          dataIndex: 'ip',
          render(_, vote) {
            return (
              <Popover
                title="IP 地址"
                placement="bottomLeft"
                content={<UniversalText text={vote.ip} copyable={true} placeholder="未知 IP" />}
              >
                <span>
                  <IPLocation ipLocation={vote.ip_location} emoji={true} />
                </span>
              </Popover>
            )
          }
        },
        {
          title: '设备',
          ellipsis: true,
          dataIndex: 'user_agent',
          render(_, vote) {
            return (
              <Popover
                title="User Agent"
                placement="bottomLeft"
                content={
                  <UserAgent userAgent={vote.user_agent} orientation="vertical" size="small" />
                }
              >
                <span>
                  <UserAgent.OverView userAgent={vote.user_agent} />
                </span>
              </Popover>
            )
          }
        }
      ]}
    />
  )
}
