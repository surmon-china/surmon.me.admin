import React from 'react'
import { Tooltip } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { GeneralAuthorType, CommentAuthorType, getAuthorTypeName } from '@/constants/author'
import { User } from '@/constants/user'
import { UniversalText } from '../UniversalText'

export interface AuthorNameProps {
  user?: User | null
  author_name?: string | null
  author_type?: GeneralAuthorType | CommentAuthorType
  icon?: boolean
  tooltip?: boolean
  strong?: boolean
}

export const AuthorName: React.FC<AuthorNameProps> = (props) => {
  const isGuest = props.author_type === GeneralAuthorType.Guest
  const isUser = props.author_type === GeneralAuthorType.User

  const state = {
    name: null as string | null,
    namePlaceholder: getAuthorTypeName(GeneralAuthorType.Anonymous),
    tooltip: null as string | null,
    delete: false
  }

  if (isGuest) {
    state.name = props.author_name || null
    state.namePlaceholder = '未知用户'
    state.tooltip = getAuthorTypeName(GeneralAuthorType.Guest)
  } else if (isUser && props.user) {
    state.name = props.user.name
    state.namePlaceholder = '未知用户'
    state.tooltip = getAuthorTypeName(GeneralAuthorType.User)
  } else if (isUser && !props.user) {
    state.name = props.author_name || null
    state.namePlaceholder = '用户已注销'
    state.tooltip = '用户已注销'
    state.delete = true
  }

  return (
    <Tooltip
      placement="right"
      destroyOnHidden={true}
      title={props.tooltip ? state.tooltip : null}
    >
      <span>
        <UniversalText
          prefix={props.icon ? <UserOutlined /> : null}
          strong={props.strong}
          delete={state.delete}
          text={state.name}
          placeholder={state.namePlaceholder}
        />
      </span>
    </Tooltip>
  )
}
