import React from 'react'
import { Table, Button, Typography, Popover, Space, Statistic } from 'antd'
import * as Icons from '@ant-design/icons'
import { AuthorName, AuthorEmail } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { UserAgent } from '@/components/common/UserAgent'
import { Pagination } from '@/constants/nodepress'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { stringToYMD } from '@/transforms/date'
import { APP_PAGE_SIZE_OPTIONS } from '@/config'

import styles from './style.module.less'

export interface TableListProps {
  loading: boolean
  data: Feedback[]
  pagination?: Pagination
  selectedIds: number[]
  onSelect(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onDetail(feedback: Feedback, index: number): void
  onDelete(feedback: Feedback, index: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Feedback>
      rowKey="id"
      tableLayout="auto"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelect
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
          width: 50,
          dataIndex: 'id'
        },
        {
          title: '标记',
          width: 60,
          ellipsis: true,
          align: 'center',
          dataIndex: 'marked',
          render: (_, feedback) => getMarkedByBoolean(feedback.marked).icon
        },
        {
          title: '评分',
          minWidth: 60,
          ellipsis: true,
          align: 'center',
          dataIndex: 'emotion',
          render: (_, feedback) => (
            <Statistic prefix={feedback.emotion_emoji} value={feedback.emotion} />
          )
        },
        {
          title: '反馈内容',
          minWidth: 260,
          dataIndex: 'content',
          render: (_, feedback) => (
            <Space orientation="vertical">
              <Typography.Paragraph
                className={styles.feedbackContent}
                ellipsis={{ rows: 3, expandable: true }}
              >
                {feedback.content}
              </Typography.Paragraph>
              <UniversalText type="secondary" text={stringToYMD(feedback.created_at!)} />
            </Space>
          )
        },
        {
          title: '作者',
          ellipsis: true,
          dataIndex: 'author_name',
          render: (_, feedback) => (
            <Space orientation="vertical">
              <AuthorName
                user={feedback.user}
                author_type={feedback.author_type}
                author_name={feedback.author_name}
                icon={true}
                tooltip={true}
              />
              <AuthorEmail
                user={feedback.user}
                author_type={feedback.author_type}
                author_email={feedback.author_email}
                icon={true}
              />
            </Space>
          )
        },
        {
          title: '来自于',
          ellipsis: true,
          dataIndex: 'user_agent',
          render(_, feedback) {
            return (
              <Space orientation="vertical">
                <Popover
                  title="网络溯源"
                  placement="topLeft"
                  content={
                    <Space orientation="vertical" size="small">
                      <UniversalText prefix="IP 地址" text={feedback.ip} copyable={true} />
                      <UniversalText prefix="Origin" text={feedback.origin} copyable={true} />
                    </Space>
                  }
                >
                  <span>
                    <IPLocation ipLocation={feedback.ip_location} icon={true} emoji={false} />
                  </span>
                </Popover>
                <Popover
                  title="User Agent"
                  placement="bottomLeft"
                  content={
                    <UserAgent
                      userAgent={feedback.user_agent}
                      orientation="vertical"
                      size="small"
                    />
                  }
                >
                  <span>
                    <UserAgent.OverView userAgent={feedback.user_agent} />
                  </span>
                </Popover>
              </Space>
            )
          }
        },
        {
          title: '操作',
          width: 120,
          dataIndex: 'actions',
          render: (_, feedback, index) => (
            <Space orientation="vertical">
              <Button
                size="small"
                variant="link"
                color="default"
                block={true}
                icon={<Icons.EditOutlined />}
                onClick={() => props.onDetail(feedback, index)}
              >
                反馈详情
              </Button>
              <Button
                size="small"
                variant="link"
                color="danger"
                block={true}
                icon={<Icons.DeleteOutlined />}
                onClick={() => props.onDelete(feedback, index)}
              >
                彻底删除
              </Button>
            </Space>
          )
        }
      ]}
    />
  )
}
