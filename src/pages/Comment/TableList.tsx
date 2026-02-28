import React from 'react'
import { Table, Button, Typography, Popover, Tag, Space, Divider } from 'antd'
import * as Icons from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { UserAgent } from '@/components/common/UserAgent'
import { IPLocation } from '@/components/common/IPLocation'
import { AuthorName } from '@/components/common/AuthorProfile'
import { Pagination } from '@/constants/nodepress'
import { Comment, CommentStatus, CommentTargetType } from '@/constants/comment'
import { getCommentStatus } from '@/constants/comment'
import { getCommentTargetType } from '@/constants/comment'
import { stringToYMD } from '@/transforms/date'
import { APP_PAGE_SIZE_OPTIONS } from '@/config'
import { CommentAvatar } from './Avatar'
import { CommentLike, CommentDislike } from './Vote'

import styles from './style.module.less'

export interface TableListProps {
  loading: boolean
  data: Comment[]
  pagination?: Pagination
  selectedIds: number[]
  onSelecte(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onDetail(comment: Comment, index: number): void
  onDelete(comment: Comment, index: number): void
  onUpdateStatus(comment: Comment, status: CommentStatus): void
  onGoToTarget(type: CommentTargetType, id: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Comment>
      rowKey="id"
      tableLayout="auto"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelecte
      }}
      pagination={{
        pageSizeOptions: APP_PAGE_SIZE_OPTIONS,
        current: props.pagination?.current_page,
        pageSize: props.pagination?.per_page,
        total: props.pagination?.total,
        showSizeChanger: true,
        onChange: props.onPaginate
      }}
      columns={[
        {
          title: '作者',
          width: 90,
          dataIndex: 'author_type',
          render: (_, comment) => <CommentAvatar comment={comment} shape="square" size={52} />
        },
        {
          title: '评论内容',
          dataIndex: 'content',
          minWidth: 380,
          render: (_, comment) => {
            const status = getCommentStatus(comment.status)
            return (
              <Space orientation="vertical">
                <Space size="small">
                  <AuthorName
                    user={comment.user}
                    author_name={comment.author_name}
                    author_type={comment.author_type}
                    strong={true}
                  />
                  <Divider orientation="vertical" />
                  <Popover
                    title="IP 地址"
                    placement="topLeft"
                    content={<UniversalText text={comment.ip} copyable={true} />}
                  >
                    <span>
                      <IPLocation ipLocation={comment.ip_location} emoji={true} />
                    </span>
                  </Popover>
                  <Divider orientation="vertical" />
                  <Tag variant="outlined" icon={status.icon} color={status.color}>
                    {status.name}
                  </Tag>
                </Space>
                <Typography.Paragraph
                  className={styles.commentContent}
                  ellipsis={{ rows: 3, expandable: true }}
                >
                  {comment.content}
                </Typography.Paragraph>
                <Space size="small">
                  <UniversalText type="secondary" text={stringToYMD(comment.created_at!)} />
                  <Divider orientation="vertical" />
                  <CommentLike likes={comment.likes} />
                  <Divider orientation="vertical" />
                  <CommentDislike dislikes={comment.dislikes} />
                </Space>
              </Space>
            )
          }
        },
        {
          title: 'ID 关系',
          ellipsis: true,
          dataIndex: 'id',
          render: (_, comment) => (
            <Space orientation="vertical">
              <UniversalText prefix="评论" text={`#${comment.id}`} />
              <UniversalText
                prefix="父评"
                text={comment.parent_id ? '#' + comment.parent_id : null}
                placeholder="无"
              />
              <Typography.Link
                onClick={() => props.onGoToTarget(comment.target_type, comment.target_id)}
              >
                <Space size="small">
                  {getCommentTargetType(comment.target_type).name}
                  <span>#{comment.target_id}</span>
                </Space>
              </Typography.Link>
            </Space>
          )
        },
        {
          title: '设备',
          ellipsis: true,
          dataIndex: 'user_agent',
          render: (_, comment) => (
            <UserAgent userAgent={comment.user_agent} orientation="vertical" />
          )
        },
        {
          title: '操作',
          dataIndex: 'actions',
          width: 110,
          ellipsis: true,
          render: (_, comment, index) => (
            <Space orientation="vertical">
              <Button
                size="small"
                color="default"
                variant="link"
                block={true}
                icon={<Icons.EditOutlined />}
                onClick={() => props.onDetail(comment, index)}
              >
                评论详情
              </Button>
              {comment.status === CommentStatus.Pending && (
                <Button
                  size="small"
                  variant="link"
                  color="green"
                  block={true}
                  icon={<Icons.CheckOutlined />}
                  onClick={() => props.onUpdateStatus(comment, CommentStatus.Published)}
                >
                  审核通过
                </Button>
              )}
              {comment.status === CommentStatus.Published && (
                <Button
                  size="small"
                  variant="link"
                  color="danger"
                  block={true}
                  icon={<Icons.StopOutlined />}
                  onClick={() => props.onUpdateStatus(comment, CommentStatus.Spam)}
                >
                  标为垃圾
                </Button>
              )}
              {(comment.status === CommentStatus.Pending ||
                comment.status === CommentStatus.Published) && (
                <Button
                  size="small"
                  variant="link"
                  color="orange"
                  block={true}
                  icon={<Icons.DeleteOutlined />}
                  onClick={() => props.onUpdateStatus(comment, CommentStatus.Trash)}
                >
                  移回收站
                </Button>
              )}
              {(comment.status === CommentStatus.Trash ||
                comment.status === CommentStatus.Spam) && (
                <>
                  <Button
                    size="small"
                    variant="link"
                    color="blue"
                    block={true}
                    icon={<Icons.RollbackOutlined />}
                    onClick={() => props.onUpdateStatus(comment, CommentStatus.Pending)}
                  >
                    退至审核
                  </Button>
                  <Button
                    size="small"
                    variant="link"
                    color="danger"
                    block={true}
                    icon={<Icons.DeleteOutlined />}
                    onClick={() => props.onDelete(comment, index)}
                  >
                    彻底删除
                  </Button>
                </>
              )}
            </Space>
          )
        }
      ]}
    />
  )
}
