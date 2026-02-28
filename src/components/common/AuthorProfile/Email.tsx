import React from 'react'
import { MailOutlined } from '@ant-design/icons'
import { GeneralAuthorType, CommentAuthorType } from '@/constants/author'
import { User } from '@/constants/user'
import { UniversalText } from '../UniversalText'

export interface AuthorEmailProps {
  user?: User | null
  author_email?: string | null
  author_type?: GeneralAuthorType | CommentAuthorType
  copyable?: boolean
  icon?: boolean
}

export const AuthorEmail: React.FC<AuthorEmailProps> = (props) => {
  const isGuest = props.author_type === GeneralAuthorType.Guest
  const isUser = props.author_type === GeneralAuthorType.User

  const state = {
    email: null as string | null,
    delete: false
  }

  if (isGuest) {
    state.email = props.author_email || null
  } else if (isUser && props.user) {
    state.email = props.user.email
  } else if (isUser && !props.user) {
    state.email = props.author_email || null
    state.delete = true
  }

  return (
    <UniversalText
      prefix={props.icon ? <MailOutlined /> : null}
      copyable={props.copyable}
      delete={state.delete}
      text={state.email}
      placeholder="无邮箱"
    />
  )
}
