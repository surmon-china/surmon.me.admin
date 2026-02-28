import React from 'react'
import { Table, Button, Tag, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { Pagination } from '@/constants/nodepress'
import { Announcement, getAnnouncementStatus } from '@/constants/announcement'
import { stringToYMD } from '@/transforms/date'
import { APP_PAGE_SIZE_OPTIONS } from '@/config'

export interface TableListProps {
  loading: boolean
  data: Announcement[]
  pagination?: Pagination
  selectedIds: number[]
  onSelect(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onEdit(announcement: Announcement, index: number): void
  onDelete(announcement: Announcement, index: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Announcement>
      rowKey="id"
      loading={props.loading}
      dataSource={props.data}
      rowSelection={{
        selectedRowKeys: props.selectedIds,
        onChange: props.onSelect
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
          title: 'ID',
          width: 60,
          dataIndex: 'id',
          responsive: ['md']
        },
        {
          title: '内容',
          dataIndex: 'content'
        },
        {
          title: '发布时间',
          dataIndex: 'created_at',
          width: 180,
          render: (_, ann) => stringToYMD(ann.created_at)
        },
        {
          title: '状态',
          width: 120,
          dataIndex: 'status',
          render: (_, ann) => {
            const status = getAnnouncementStatus(ann.status)
            return (
              <Tag variant="outlined" icon={status.icon} color={status.color}>
                {status.name}
              </Tag>
            )
          }
        },
        {
          title: '操作',
          width: 160,
          dataIndex: 'actions',
          render: (_, ann, index) => (
            <Space.Compact size="small">
              <Button
                color="default"
                variant="link"
                icon={<Icons.EditOutlined />}
                onClick={() => props.onEdit(ann, index)}
              >
                编辑
              </Button>
              <Button
                color="danger"
                variant="link"
                danger={true}
                icon={<Icons.DeleteOutlined />}
                onClick={() => props.onDelete(ann, index)}
              >
                删除
              </Button>
            </Space.Compact>
          )
        }
      ]}
    />
  )
}
