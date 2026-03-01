import React from 'react'
import { Avatar, AvatarProps, Badge, Modal, Descriptions } from 'antd'
import { Typography, Divider, Tooltip, Row, Col } from 'antd'
import * as Icons from '@ant-design/icons'
import { GeneralAuthorType, CommentAuthorType, getAuthorTypeName } from '@/constants/author'
import { User, UserType, getUserType } from '@/constants/user'
import { getGravatarByHash } from '@/transforms/avatar'
import { stringToYMD } from '@/transforms/date'
import { UniversalText } from '../UniversalText'
import { APP_PRIMARY_COLOR } from '@/config'

export interface AuthorAvatarProps {
  user?: User | null
  author_name?: string | null
  author_email?: string | null
  author_email_hash?: string | null
  author_website?: string | null
  author_type?: GeneralAuthorType | CommentAuthorType
  badge?: boolean
  tooltip?: boolean
  size?: number
  shape?: AvatarProps['shape']
}

export const AuthorAvatar: React.FC<AuthorAvatarProps> = (props) => {
  const isAnonymous = props.author_type === GeneralAuthorType.Anonymous
  const isGuest = props.author_type === GeneralAuthorType.Guest
  const isUser = props.author_type === GeneralAuthorType.User
  const isModeratorUser = isUser && props.user?.type === UserType.Moderator

  const state = {
    icon: (<Icons.MinusOutlined />) as React.ReactNode,
    alt: 'avatar',
    src: null as string | null,
    badgeText: null as string | null,
    badgeColor: null as string | null,
    tooltip: null as string | null
  }

  if (isGuest) {
    state.icon = <Icons.UserOutlined />
    state.src = props.author_email_hash ? getGravatarByHash(props.author_email_hash) : null
    state.alt = props.author_name || '访客'
    state.tooltip = getAuthorTypeName(GeneralAuthorType.Guest)
  } else if (isUser && props.user) {
    state.icon = <Icons.UserOutlined />
    state.src = props.user.avatar_url || null
    state.alt = props.user.name || '用户'
    state.badgeText = isModeratorUser ? '博主' : '用户'
    state.badgeColor = isModeratorUser ? APP_PRIMARY_COLOR : 'pink'
    state.tooltip = getAuthorTypeName(GeneralAuthorType.User)
  } else if (isUser && !props.user) {
    state.icon = <Icons.StopOutlined />
    state.badgeText = '注销'
    state.badgeColor = 'red'
    state.alt = props.author_name || '已注销'
    state.tooltip = '用户已注销'
  }

  const openAuthorInfoModal = () => {
    Modal.info({
      centered: true,
      closable: true,
      closeIcon: true,
      icon: null,
      footer: null,
      width: '40rem',
      title: state.tooltip,
      content: (
        <div>
          <Divider size="middle" />
          <Row gutter={24}>
            <Col span={20}>
              <Descriptions
                layout="horizontal"
                size="middle"
                column={1}
                items={[
                  {
                    key: 'author_type',
                    label: 'author_type',
                    children: props.author_type
                  },
                  {
                    key: 'author_name',
                    label: 'author_name',
                    children: <UniversalText text={props.author_name} placeholder="无" />
                  },
                  {
                    key: 'author_email',
                    label: 'author_email',
                    children: (
                      <UniversalText text={props.author_email} copyable={true} placeholder="无" />
                    )
                  },
                  {
                    key: 'author_website',
                    label: 'author_website',
                    children: props.author_website ? (
                      <Typography.Link target="_blank" href={props.author_website}>
                        {props.author_website}
                      </Typography.Link>
                    ) : (
                      <Typography.Text type="secondary">无</Typography.Text>
                    )
                  }
                ]}
              />
            </Col>
            <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Avatar
                size={68}
                shape={props.shape ?? 'square'}
                draggable={false}
                icon={state.icon}
                src={state.src}
                alt={state.alt}
              />
            </Col>
          </Row>
          {props.user && (
            <>
              <Divider size="middle" />
              <Descriptions
                layout="horizontal"
                column={2}
                size="middle"
                items={[
                  {
                    key: 'user_id',
                    label: '用户 ID',
                    children: props.user.id
                  },
                  {
                    key: 'user_created_at',
                    label: '注册时间',
                    children: <UniversalText text={stringToYMD(props.user.created_at)} />
                  },
                  {
                    span: 2,
                    key: 'user_name',
                    label: 'user_name',
                    children: (
                      <span>
                        <UniversalText text={props.user.name} placeholder="无" />
                        <Typography.Text type="secondary">
                          （{getUserType(props.user.type).name}）
                        </Typography.Text>
                      </span>
                    )
                  },
                  {
                    span: 2,
                    key: 'user_email',
                    label: 'user_email',
                    children: (
                      <UniversalText text={props.user.email} copyable={true} placeholder="无" />
                    )
                  },
                  {
                    span: 2,
                    key: 'user_website',
                    label: 'user_website',
                    children: props.user.website ? (
                      <Typography.Link target="_blank" href={props.user.website}>
                        {props.user.website}
                      </Typography.Link>
                    ) : (
                      <Typography.Text type="secondary">无</Typography.Text>
                    )
                  }
                ]}
              />
            </>
          )}
        </div>
      )
    })
  }

  return (
    <Tooltip placement="left" title={props.tooltip ? state.tooltip : null}>
      <Badge count={props.badge ? state.badgeText : null} color={state.badgeColor ?? undefined}>
        <Avatar
          size={props.size ?? 60}
          shape={props.shape ?? 'square'}
          draggable={false}
          icon={state.icon}
          src={state.src}
          alt={state.alt}
          style={isAnonymous ? {} : { cursor: 'pointer' }}
          onClick={() => !isAnonymous && openAuthorInfoModal()}
        />
      </Badge>
    </Tooltip>
  )
}
