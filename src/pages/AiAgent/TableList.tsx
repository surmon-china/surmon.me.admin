import React from 'react'
import { Table, Space, Popover, Typography, Divider, Statistic } from 'antd'
import * as Icons from '@ant-design/icons'
import { ChatSession } from '@/constants/ai-agent'
import { GeneralAuthorType, getAuthorTypeName } from '@/constants/author'
import { AuthorName, AuthorEmail } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import { timestampToYMD } from '@/transforms/date'

export interface TableListProps {
  loading: boolean
  data: ChatSession[]
  footer?: React.ReactNode
  onDetail(sessionId: string, index: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<ChatSession>
      rowKey="id"
      tableLayout="auto"
      loading={props.loading}
      dataSource={props.data}
      footer={() => props.footer}
      pagination={false}
      columns={[
        {
          title: '最后对话',
          dataIndex: 'content',
          render: (_, session, index) => (
            <Space size="small" orientation="vertical">
              <Space size="small" separator={<Divider orientation="vertical" />}>
                <Typography.Link onClick={() => props.onDetail(session.session_id, index)}>
                  对话记录
                </Typography.Link>
                <UniversalText
                  text={timestampToYMD(session.last_active * 1000)}
                  type="secondary"
                />
              </Space>
              <Typography.Text style={{ textWrap: 'auto' }}>
                {session.last_user_message}
              </Typography.Text>
            </Space>
          )
        },
        {
          title: '对话次数',
          minWidth: 100,
          ellipsis: true,
          dataIndex: 'last_active',
          render: (_, session) => <Statistic value={session.message_count} />
        },
        {
          title: 'Token 用量',
          minWidth: 130,
          ellipsis: true,
          dataIndex: 'total_tokens',
          render: (_, session) => (
            <Popover
              title="Token 用量"
              placement="bottomLeft"
              content={
                <Space orientation="vertical" size="small">
                  <UniversalText prefix="总计" text={session.total_tokens} strong />
                  <UniversalText prefix="输入" text={session.input_tokens} type="secondary" />
                  <UniversalText prefix="输出" text={session.output_tokens} type="secondary" />
                </Space>
              }
            >
              <Statistic value={session.total_tokens} />
            </Popover>
          )
        },
        {
          title: '用户',
          minWidth: 120,
          ellipsis: true,
          dataIndex: 'author_name',
          render: (_, session) => (
            <Popover
              title="用户身份"
              placement="bottomLeft"
              content={
                <Space orientation="vertical" size="small">
                  <UniversalText
                    prefix={<Icons.UserOutlined />}
                    text={session.user_id}
                    placeholder="非登录用户"
                  />
                  <AuthorName author_name={session.author_name} icon={true} />
                  <AuthorEmail author_email={session.author_email} icon={true} />
                </Space>
              }
            >
              <span>
                <UniversalText
                  text={session.user_id || session.author_name}
                  placeholder={getAuthorTypeName(GeneralAuthorType.Anonymous)}
                />
              </span>
            </Popover>
          )
        }
      ]}
    />
  )
}
