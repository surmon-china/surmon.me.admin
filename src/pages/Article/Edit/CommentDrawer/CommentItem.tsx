import React from 'react'
import { Divider, Flex, Space, Tag, Typography } from 'antd'
import { IPLocation } from '@/components/common/IPLocation'
import { AuthorName } from '@/components/common/AuthorProfile'
import { CommentLike, CommentDislike } from '@/pages/Comment/Vote'
import { CommentAvatar } from '@/pages/Comment/Avatar'
import { getCommentStatus } from '@/constants/comment'
import { stringToYMD } from '@/transforms/date'
import { CommentTree } from './tree'

interface CommentItemProps {
  comment: CommentTree
  isReply?: boolean
  children?: React.ReactNode
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, isReply, children }) => {
  return (
    <Flex align="flex-start" gap="large" style={{ width: '100%' }}>
      <div style={{ marginTop: 'var(--app-padding)' }}>
        <CommentAvatar size={48} shape="square" comment={comment} />
      </div>
      <Space orientation="vertical" size="small" style={{ flex: 1 }}>
        <Flex justify="space-between">
          <Space size="small">
            <AuthorName
              user={comment.user}
              author_name={comment.author_name}
              author_type={comment.author_type}
              strong={true}
            />
            {isReply && comment.reply_to && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                回复 @{comment.reply_to.author_name}
              </Typography.Text>
            )}
            <IPLocation key="ip-location" ipLocation={comment.ip_location} emoji={true} />
            <Divider orientation="vertical" />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {stringToYMD(comment.created_at!)}
            </Typography.Text>
          </Space>
          <Tag
            color={getCommentStatus(comment.status).color}
            icon={getCommentStatus(comment.status).icon}
          >
            {getCommentStatus(comment.status).name}
          </Tag>
        </Flex>
        <Typography.Paragraph style={{ margin: 0 }}>{comment.content}</Typography.Paragraph>
        <Space>
          <CommentLike likes={comment.likes} />
          <CommentDislike dislikes={comment.dislikes} />
        </Space>
        {children}
      </Space>
    </Flex>
  )
}
