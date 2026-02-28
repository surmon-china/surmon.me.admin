import React from 'react'
import { Avatar, AvatarProps } from 'antd'
import * as Icons from '@ant-design/icons'
import { Comment } from '@/constants/comment'
import { CommentAuthorType } from '@/constants/author'
import { AuthorAvatar } from '@/components/common/AuthorProfile'
import { getDisqusAvatarByUsername } from '@/transforms/avatar'
import { getKeyValue } from '@/transforms/key-value'
import { APP_PRIMARY_COLOR } from '@/config'

export interface CommentAvatarProps {
  comment: Comment
  size: number
  shape: AvatarProps['shape']
}

export const CommentAvatar: React.FC<CommentAvatarProps> = (props) => {
  const { comment, size, shape } = props
  const disqusUsername = getKeyValue(props.comment.extras, 'disqus-author-username')
  if (disqusUsername && comment.author_type !== CommentAuthorType.User) {
    return <Avatar shape={shape} size={size} src={getDisqusAvatarByUsername(disqusUsername)} />
  }

  const isAiGenerated = getKeyValue(props.comment.extras, 'ai-generated')
  if (isAiGenerated) {
    return (
      <Avatar
        shape={shape}
        size={size}
        icon={<Icons.RobotFilled />}
        style={{ background: `linear-gradient(45deg, #fa4340, ${APP_PRIMARY_COLOR}, #19ba64)` }}
      />
    )
  }

  return (
    <AuthorAvatar
      user={comment.user}
      author_type={comment.author_type}
      author_name={comment.author_name}
      author_email={comment.author_email}
      author_email_hash={comment.author_email_hash}
      badge={true}
      shape={shape}
      size={size}
    />
  )
}
