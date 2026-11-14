import React from 'react'
import { useShallowRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import {
  Descriptions,
  Typography,
  Flex,
  Space,
  Skeleton,
  Statistic,
  Avatar,
  Divider,
  Listy,
  Empty
} from 'antd'
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
    return messages.value.length ? (
      <Listy
        rowHoverable={false}
        items={messages.value}
        rowKey={(_, index) => index}
        styles={{ item: { padding: '12px 0' } }}
        itemRender={(message) => (
          <div style={{ overflow: 'hidden' }}>
            <Flex gap="middle" align="start" style={{ marginBottom: 16 }}>
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
              <Flex orientation="vertical" gap="small">
                {message.role === 'user' ? (
                  <UniversalText
                    text={props.session.author_name}
                    placeholder={getAuthorTypeName(GeneralAuthorType.Anonymous)}
                    strong={true}
                  />
                ) : (
                  <UniversalText text={message.role} strong={true} />
                )}
                <Typography.Text type="secondary">
                  {timestampToYMD(message.created_at * 1000)}
                </Typography.Text>
              </Flex>
            </Flex>
            <Typography.Paragraph
              ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
              style={{ maxHeight: '14em', overflowY: 'auto' }}
            >
              {message.tool_calls || message.content || '-'}
            </Typography.Paragraph>
            {message.role !== 'user' && (
              <Flex justify="end">
                <Space separator={<Divider orientation="vertical" />}>
                  <UniversalText text={message.model} type="secondary" />
                  <UniversalText prefix="Input" text={message.input_tokens} type="secondary" />
                  <UniversalText prefix="Output" text={message.output_tokens} type="secondary" />
                </Space>
              </Flex>
            )}
          </div>
        )}
      />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
