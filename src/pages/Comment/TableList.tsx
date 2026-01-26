import React from 'react'
import { Table, Button, Typography, Popover, Tag, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { Placeholder } from '@/components/common/Placeholder'
import { IPLocation } from '@/components/common/IPLocation'
import { Pagination } from '@/constants/nodepress'
import { Comment, CommentStatus, getCommentStatus } from '@/constants/comment'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { stringToYMD } from '@/transforms/date'
import { CommentAvatar } from './Avatar'

import styles from './style.module.less'

export interface TableListProps {
  loading: boolean
  data: Comment[]
  pagination?: Pagination
  selectedIds: string[]
  onSelecte(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onDetail(comment: Comment, index: number): void
  onDelete(comment: Comment, index: number): void
  onUpdateStatus(comment: Comment, status: CommentStatus): void
  onClickPostId(id: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Comment>
      rowKey="_id"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelecte
      }}
      pagination={{
        pageSizeOptions: ['10', '20', '50'],
        current: props.pagination?.current_page,
        pageSize: props.pagination?.per_page,
        total: props.pagination?.total,
        showSizeChanger: true,
        onChange: props.onPaginate
      }}
      columns={[
        {
          title: 'ID',
          width: 60,
          dataIndex: 'id',
          responsive: ['md']
        },
        {
          title: 'POST_ID',
          width: 50,
          dataIndex: 'post_id',
          responsive: ['md'],
          render(_, comment) {
            return (
              <Button size="small" onClick={() => props.onClickPostId(comment.post_id)}>
                {comment.post_id}
              </Button>
            )
          }
        },
        {
          title: '评论内容',
          dataIndex: 'content',
          render: (_, comment) => (
            <Space orientation="vertical">
              <Typography.Paragraph
                className={styles.commentContent}
                ellipsis={{ rows: 5, expandable: true }}
              >
                {comment.content}
              </Typography.Paragraph>
              <UniversalText type="secondary" text={stringToYMD(comment.created_at!)} />
            </Space>
          )
        },
        {
          title: '个人信息',
          width: 220,
          dataIndex: 'author',
          render(_, comment) {
            return (
              <Space orientation="vertical">
                <Space>
                  <CommentAvatar comment={comment} size={28} />
                  <UniversalText text={comment.author.name} />
                </Space>
                <Space orientation="vertical" size="small">
                  <UniversalText
                    placeholder="Left blank"
                    prefix={<Icons.MailOutlined />}
                    text={comment.author.email}
                    copyable={true}
                  />
                  <Space size="small">
                    <Icons.LinkOutlined />
                    <Placeholder data={comment.author.site} placeholder="Left blank">
                      {(site) => (
                        <Popover placement="top" content={site}>
                          <Typography.Link target="_blank" rel="noreferrer" href={site}>
                            点击打开
                          </Typography.Link>
                        </Popover>
                      )}
                    </Placeholder>
                  </Space>
                </Space>
              </Space>
            )
          }
        },
        {
          title: '终端信息',
          dataIndex: 'agent',
          minWidth: 220,
          render(_, comment) {
            return (
              <Space orientation="vertical">
                <UniversalText
                  prefix={<Icons.GlobalOutlined />}
                  text={comment.ip}
                  copyable={true}
                />
                <Space size="small">
                  <Icons.EnvironmentOutlined />
                  <IPLocation data={comment.ip_location} />
                </Space>
                <Space size="small">
                  <Icons.CompassOutlined />
                  <Popover
                    title="终端信息"
                    placement="right"
                    content={
                      <div>
                        <Typography.Paragraph>
                          <UniversalText prefix="浏览器" text={parseBrowser(comment.agent)} />
                        </Typography.Paragraph>
                        <Typography.Paragraph>
                          <UniversalText prefix="系统" text={parseOS(comment.agent)} />
                        </Typography.Paragraph>
                        <div>
                          <UniversalText prefix="设备" text={parseDevice(comment.agent)} />
                        </div>
                      </div>
                    }
                  >
                    {parseBrowser(comment.agent) ||
                      parseOS(comment.agent) ||
                      parseDevice(comment.agent)}
                  </Popover>
                </Space>
              </Space>
            )
          }
        },
        {
          title: '状态',
          width: 80,
          dataIndex: 'status',
          render: (_, comment) => {
            const status = getCommentStatus(comment.status)
            return (
              <Space orientation="vertical">
                <Tag variant="outlined" icon={status.icon} color={status.color}>
                  {status.name}
                </Tag>
                <Tag
                  variant="outlined"
                  icon={<Icons.LikeOutlined />}
                  color={comment.likes > 0 ? 'blue' : undefined}
                >
                  {comment.likes} 个赞
                </Tag>
                <Tag
                  variant="outlined"
                  icon={<Icons.DislikeOutlined />}
                  color={comment.dislikes > 0 ? 'blue' : undefined}
                >
                  {comment.dislikes} 个踩
                </Tag>
              </Space>
            )
          }
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'actions',
          render: (_, comment, index) => (
            <Space orientation="vertical">
              <Button
                size="small"
                type="text"
                block={true}
                icon={<Icons.EditOutlined />}
                onClick={() => props.onDetail(comment, index)}
              >
                评论详情
              </Button>
              {comment.status === CommentStatus.Pending && (
                <Button
                  size="small"
                  variant="text"
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
                  variant="text"
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
                  variant="text"
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
                    variant="text"
                    color="blue"
                    block={true}
                    icon={<Icons.RollbackOutlined />}
                    onClick={() => props.onUpdateStatus(comment, CommentStatus.Pending)}
                  >
                    退至审核
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    danger={true}
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
