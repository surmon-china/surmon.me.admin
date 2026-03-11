import React from 'react'
import { useShallowRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Descriptions, Typography, List, Skeleton, Statistic, Avatar, Divider } from 'antd'
import * as Icons from '@ant-design/icons'
import type { ChatSession, ChatMessage } from '@/constants/ai-agent'
import { GeneralAuthorType, getAuthorTypeName } from '@/constants/author'
import { UniversalText } from '@/components/common/UniversalText'
import * as api from '@/apis/ai-agent'
import { timestampToYMD } from '@/transforms/date'
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
      column={1}
      items={[
        {
          key: 'id',
          label: 'Session ID',
          children: <UniversalText text={props.session.session_id} copyable />
        },
        {
          key: 'content',
          label: '最后对话时间',
          children: <UniversalText text={timestampToYMD(props.session.last_active * 1000)} />
        }
      ]}
    />
  )

  const renderUsageStats = () => (
    <Descriptions
      column={4}
      items={[
        {
          key: 'user_id',
          label: '用户 ID',
          children: (
            <UniversalText text={props.session.user_id} placeholder="非登录用户" strong={true} />
          )
        },
        {
          key: 'author_name',
          label: '用户名称',
          children: (
            <UniversalText
              text={props.session.author_name}
              placeholder={getAuthorTypeName(GeneralAuthorType.Anonymous)}
            />
          )
        },
        {
          key: 'author_email',
          span: 4,
          children: (
            <UniversalText
              text={props.session.author_email}
              copyable={true}
              placeholder="无邮箱"
            />
          )
        },
        {
          key: 'message_count',
          children: <Statistic title="消息数量" value={props.session.message_count} />
        },
        {
          key: 'total_tokens',
          children: <Statistic title="总用 Token" value={props.session.total_tokens} />
        },
        {
          key: 'input_tokens',
          children: <Statistic title="输入 Token" value={props.session.input_tokens} />
        },
        {
          key: 'output_tokens',
          children: <Statistic title="输出 Token" value={props.session.output_tokens} />
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
            actions={
              message.role === 'user'
                ? []
                : [
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
                  ]
            }
          >
            <List.Item.Meta
              title={
                message.role === 'user' ? (
                  <UniversalText
                    text={props.session.author_name}
                    placeholder={getAuthorTypeName(GeneralAuthorType.Anonymous)}
                    strong={true}
                  />
                ) : (
                  <UniversalText text={message.role} strong={true} />
                )
              }
              description={timestampToYMD(message.created_at * 1000)}
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
      {renderUsageStats()}
      <Divider />
      {fetching.state.value ? <Skeleton /> : renderMessages()}
    </div>
  )
}
