import React from 'react'
import { List, Divider, Flex, Space, Tag, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { IPLocation } from '@/components/common/IPLocation'
import { UniversalText } from '@/components/common/UniversalText'
import { CommentAvatar } from '@/pages/Comment/Avatar'
import { getCommentStatus } from '@/constants/comment'
import { CommentTree } from '@/apis/comment'
import { stringToYMD } from '@/transforms/date'
import { parseBrowser, parseOS } from '@/transforms/ua'

export interface CommentTreeListProps {
  comments: CommentTree[]
  loading?: boolean
}

export const CommentTreeList: React.FC<CommentTreeListProps> = (props) => {
  return (
    <List
      itemLayout="vertical"
      loading={props.loading}
      dataSource={props.comments}
      renderItem={(comment) => (
        <List.Item>
          <Flex align="flex-start" gap="large">
            <div style={{ marginTop: 'var(--app-padding)' }}>
              <CommentAvatar size={46} comment={comment} />
            </div>
            <Space orientation="vertical" size="small" style={{ flex: 1 }}>
              <Flex justify="space-between">
                <div>
                  {comment.author.site ? (
                    <Typography.Link
                      href={comment.author.site}
                      title={comment.author.site}
                      target="_blank"
                      rel="noreferrer"
                      strong
                    >
                      {comment.author.name}
                    </Typography.Link>
                  ) : (
                    <Typography.Text strong>{comment.author.name}</Typography.Text>
                  )}
                  <Divider orientation="vertical" />
                  <Typography.Text type="secondary">
                    <IPLocation key="ip-location" data={comment.ip_location} />
                  </Typography.Text>
                  <Divider orientation="vertical" />
                  <Typography.Text type="secondary">
                    {stringToYMD(comment.created_at!)}
                  </Typography.Text>
                </div>
                <Tag
                  color={getCommentStatus(comment.status).color}
                  icon={getCommentStatus(comment.status).icon}
                >
                  {getCommentStatus(comment.status).name}
                </Tag>
              </Flex>
              <Typography.Paragraph style={{ margin: 0 }}>{comment.content}</Typography.Paragraph>
              <Space>
                <Typography.Text type={comment.likes > 0 ? 'danger' : 'secondary'}>
                  {comment.likes > 0 ? <Icons.LikeFilled /> : <Icons.LikeOutlined />}{' '}
                  {comment.likes}
                </Typography.Text>
                <Typography.Text type={comment.dislikes > 0 ? 'warning' : 'secondary'}>
                  {comment.dislikes > 0 ? <Icons.DislikeFilled /> : <Icons.DislikeOutlined />}{' '}
                  {comment.dislikes}
                </Typography.Text>
                <UniversalText
                  type="secondary"
                  placeholder="-"
                  small={true}
                  text={parseBrowser(comment.agent!)}
                />
                <UniversalText
                  type="secondary"
                  placeholder="-"
                  small={true}
                  text={parseOS(comment.agent!)}
                />
              </Space>
              {comment.children?.length ? (
                <CommentTreeList comments={comment.children || []} />
              ) : (
                ''
              )}
            </Space>
          </Flex>
        </List.Item>
      )}
    />
  )
}
