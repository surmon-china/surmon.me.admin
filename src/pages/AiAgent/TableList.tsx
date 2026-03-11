import React from 'react'
import { Table, Space, Popover, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { ChatSession } from '@/constants/ai-agent'
import { GeneralAuthorType, getAuthorTypeName } from '@/constants/author'
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
          ellipsis: true,
          dataIndex: 'last_active',
          render: (_, session) => (
            <UniversalText text={timestampToYMD(session.last_active * 1000)} type="secondary" />
          )
        },
        {
          title: '最后消息',
          dataIndex: 'last_user_message',
          render: (_, session) => (
            <Popover
              placement="bottom"
              content={<Typography.Text>{session.last_user_message}</Typography.Text>}
            >
              <Typography.Text ellipsis={{ suffix: '...' }}>
                {session.last_user_message}
              </Typography.Text>
            </Popover>
          )
        },
        {
          title: '消息数量',
          minWidth: 100,
          ellipsis: true,
          dataIndex: 'message_count',
          render: (_, session) => <UniversalText text={session.message_count} strong={true} />
        },
        {
          title: 'Token 总用量',
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
              <span>
                <UniversalText text={session.total_tokens} strong={true} />
              </span>
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
              placement="bottomRight"
              content={
                <Space orientation="vertical" size="small">
                  <UniversalText
                    prefix={<Icons.FieldNumberOutlined />}
                    text={session.user_id}
                    placeholder="非登录用户"
                    strong={true}
                  />
                  <UniversalText
                    prefix={<Icons.UserOutlined />}
                    text={session.author_name}
                    placeholder={getAuthorTypeName(GeneralAuthorType.Anonymous)}
                  />
                  <UniversalText
                    prefix={<Icons.MailOutlined />}
                    text={session.author_email}
                    placeholder="无邮箱"
                    copyable={true}
                  />
                </Space>
              }
            >
              <span>
                <UniversalText
                  text={session.author_name}
                  placeholder={getAuthorTypeName(GeneralAuthorType.Anonymous)}
                  strong={true}
                />
              </span>
            </Popover>
          )
        },
        {
          title: 'session',
          dataIndex: 'session_id',
          render: (_, session, index) => (
            <Typography.Link onClick={() => props.onDetail(session.session_id, index)}>
              对话记录
            </Typography.Link>
          )
        }
      ]}
    />
  )
}
