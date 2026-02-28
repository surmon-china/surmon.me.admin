import React from 'react'
import { Typography } from 'antd'
import * as Icons from '@ant-design/icons'

export const CommentLike: React.FC<{ likes: number }> = (props) => {
  return (
    <Typography.Text strong={props.likes > 0} type={props.likes > 0 ? undefined : 'secondary'}>
      {props.likes > 0 ? <Icons.LikeFilled /> : <Icons.LikeOutlined />} {props.likes}
    </Typography.Text>
  )
}

export const CommentDislike: React.FC<{ dislikes: number }> = (props) => {
  return (
    <Typography.Text
      strong={props.dislikes > 0}
      type={props.dislikes > 0 ? undefined : 'secondary'}
    >
      {props.dislikes > 0 ? <Icons.DislikeFilled /> : <Icons.DislikeOutlined />} {props.dislikes}
    </Typography.Text>
  )
}
