import React from 'react'
import { useShallowRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Descriptions, Typography, List, Skeleton, Avatar, Divider } from 'antd'
import * as Icons from '@ant-design/icons'
import { AuthorName, AuthorEmail } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import * as api from '@/apis/ai-agent'
import type { ChatSession, ChatMessage } from '@/constants/ai-agent'
import { stringToYMD } from '@/transforms/date'
import { APP_PRIMARY_COLOR } from '@/config'

export interface SessionDetailProps {
  session: ChatSession
}

export const SessionDetail: React.FC<SessionDetailProps> = (props) => {
  const fetching = useLoading()
  const messages = useShallowRef<ChatMessage[]>([])

  onMounted(() => {
    fetching.promise(api.getChatMessages(props.session.session_id)).then((data) => {
      messages.value = data.reverse()
    })
  })

  const renderSessionInfos = () => (
    <Descriptions
      column={3}
      items={[
        {
          key: 'id',
          span: 3,
          label: 'Session ID',
          children: <UniversalText text={props.session.session_id} />
        },
        {
          key: 'content',
          span: 2,
          label: '最后对话时间',
          children: <UniversalText text={stringToYMD(props.session.last_active)} />
        },
        {
          key: 'last_active',
          label: '对话次数',
          children: <UniversalText text={props.session.message_count} strong />
        },
        {
          key: 'total_tokens',
          label: 'Token 总用',
          children: <UniversalText text={props.session.total_tokens} strong />
        },
        {
          key: 'input_tokens',
          label: 'Token 输入',
          children: <UniversalText text={props.session.input_tokens} strong />
        },
        {
          key: 'output_tokens',
          label: 'Token 输出',
          children: <UniversalText text={props.session.output_tokens} strong />
        },
        {
          key: 'user_id',
          label: '用户 ID',
          children: <UniversalText text={props.session.user_id} placeholder="非登录用户" />
        },
        {
          key: 'author_name',
          label: '用户名称',
          children: <AuthorName author_name={props.session.author_name} />
        },
        {
          key: 'author_email',
          label: '用户邮箱',
          children: <AuthorEmail author_email={props.session.author_email} />
        }
      ]}
    />
  )

  const renderMessages = () => {
    return (
      <List
        itemLayout="vertical"
        dataSource={messages.value}
        renderItem={(message, index) => (
          <List.Item
            key={index}
            style={{ overflow: 'hidden' }}
            actions={[
              <UniversalText key="model" text={message.model} type="secondary" />,
              <UniversalText
                key="input_tokens"
                prefix="Input"
                text={message.input_tokens}
                type="secondary"
              />,
              <UniversalText
                key="output_tokens"
                prefix="Output"
                text={message.output_tokens}
                type="secondary"
              />
            ]}
          >
            <List.Item.Meta
              title={<UniversalText text={message.role.toUpperCase()} strong={true} />}
              description={stringToYMD(message.created_at)}
              avatar={
                <Avatar
                  size={56}
                  style={{
                    background:
                      message.role === 'user'
                        ? 'orange'
                        : `linear-gradient(45deg, #fa4340, ${APP_PRIMARY_COLOR}, #19ba64)`
                  }}
                  icon={
                    message.role === 'user' ? (
                      <Icons.UserOutlined />
                    ) : message.role === 'assistant' ? (
                      <Icons.RobotOutlined />
                    ) : (
                      <Icons.ToolOutlined />
                    )
                  }
                />
              }
            />
            <Typography.Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ maxHeight: '14em', overflowY: 'auto' }}
            >
              {message.tool_calls || message.content || '-'}
            </Typography.Paragraph>
          </List.Item>
        )}
      />
    )
  }

  return (
    <div>
      {renderSessionInfos()}
      <Divider />
      {fetching.state.value ? <Skeleton /> : renderMessages()}
    </div>
  )
}
