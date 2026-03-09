import React from 'react'
import { Table, Space, Popover, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { ChatSession } from '@/constants/ai-agent'
import { GeneralAuthorType, getAuthorTypeName } from '@/constants/author'
import { AuthorName, AuthorEmail } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import { stringToYMD } from '@/transforms/date'

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
          title: 'Session ID',
          minWidth: 260,
          dataIndex: 'content',
          render: (_, session, index) => (
            <Typography.Link onClick={() => props.onDetail(session.session_id, index)}>
              {session.session_id}
            </Typography.Link>
          )
        },
        {
          title: '最后对话',
          dataIndex: 'content',
          render: (_, session) => <UniversalText text={stringToYMD(session.last_active)} />
        },
        {
          title: '对话次数',
          minWidth: 60,
          dataIndex: 'last_active',
          render: (_, session) => <UniversalText text={session.message_count} strong />
        },
        {
          title: 'Token 总用',
          dataIndex: 'total_tokens',
          render: (_, session) => <UniversalText text={session.total_tokens} strong />
        },
        {
          title: 'Token 输入',
          dataIndex: 'input_tokens',
          render: (_, session) => <UniversalText text={session.input_tokens} strong />
        },
        {
          title: 'Token 输出',
          dataIndex: 'output_tokens',
          render: (_, session) => <UniversalText text={session.output_tokens} strong />
        },
        {
          title: '用户',
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
