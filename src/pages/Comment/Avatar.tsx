import React from 'react'
import { Avatar, AvatarProps, Popover } from 'antd'
import { Comment } from '@/constants/comment'
import { autoCommentAvatar } from '@/transforms/avatar'
import { getDisqusUserName } from '@/transforms/disqus'
import { getResourceUrl } from '@/transforms/url'

import styles from './style.module.less'

export interface CommentAvatarProps {
  comment: Comment
  size?: AvatarProps['size']
}

export const CommentAvatar: React.FC<CommentAvatarProps> = (props) => {
  const isDisqusUser = !!getDisqusUserName(props.comment.extras)
  const title = isDisqusUser ? 'Disqus user' : 'Guest user'
  const iconUrl = isDisqusUser ? '/images/disqus.svg' : '/images/logo.mini.svg'
  return (
    <div className={styles.avatarWrapper}>
      <Avatar shape="square" size={props.size} src={autoCommentAvatar(props.comment)} />
      <Popover placement="right" content={title}>
        <span className={styles.avatarBadge}>
          <img className={styles.avatarBadgeIcon} src={getResourceUrl(iconUrl)} />
        </span>
      </Popover>
    </div>
  )
}
