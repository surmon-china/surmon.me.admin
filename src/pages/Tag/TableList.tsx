import React from 'react'
import { Table, Button, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { Pagination } from '@/constants/nodepress'
import { Tag } from '@/constants/tag'
import { getBlogTagUrl } from '@/transforms/url'
import { APP_PAGE_SIZE_OPTIONS } from '@/config'

export interface TableListProps {
  loading: boolean
  data: Tag[]
  pagination?: Pagination
  selectedIds: number[]
  onSelect(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onEdit(tag: Tag, index: number): void
  onDelete(tag: Tag, index: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<Tag>
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
          title: '名称',
          dataIndex: 'name',
          width: 140
        },
        {
          title: '别名',
          dataIndex: 'slug',
          width: 160
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '文章',
          width: 80,
          align: 'right',
          dataIndex: 'article_count'
        },
        {
          title: '操作',
          width: 240,
          align: 'right',
          dataIndex: 'actions',
          render: (_, tag, index) => (
            <Space.Compact size="small">
              <Button
                color="default"
                variant="link"
                icon={<Icons.EditOutlined />}
                onClick={() => props.onEdit(tag, index)}
              >
                编辑
              </Button>
              <Button
                color="danger"
                variant="link"
                danger={true}
                icon={<Icons.DeleteOutlined />}
                onClick={() => props.onDelete(tag, index)}
              >
                删除
              </Button>
              <Button
                type="link"
                target="_blank"
                icon={<Icons.ExportOutlined />}
                href={getBlogTagUrl(tag.slug)}
              >
                查看
              </Button>
            </Space.Compact>
          )
        }
      ]}
    />
  )
}
