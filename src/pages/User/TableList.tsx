import React from 'react'
import { Table, Button, Space, message } from 'antd'
import * as Icons from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { AuthorAvatar, AuthorName, AuthorEmail } from '@/components/common/AuthorProfile'
import { GeneralAuthorType } from '@/constants/author'
import { User, getUserIdentityList } from '@/constants/user'
import { Pagination } from '@/constants/nodepress'
import { stringToYMD } from '@/transforms/date'
import { APP_PAGE_SIZE_OPTIONS } from '@/config'

export interface TableListProps {
  loading: boolean
  data: User[]
  pagination?: Pagination
  selectedIds: number[]
  onSelect(ids: any[]): void
  onPaginate(page: number, pageSize?: number): void
  onDetail(user: User, index: number): void
  onDelete(user: User, index: number): void
}

export const TableList: React.FC<TableListProps> = (props) => {
  return (
    <Table<User>
      rowKey="id"
      tableLayout="auto"
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
          width: 40,
          dataIndex: 'id'
        },
        {
          title: '头像',
          minWidth: 100,
          ellipsis: true,
          dataIndex: 'avatar',
          render(_, user) {
            return <AuthorAvatar user={user} author_type={GeneralAuthorType.User} badge={true} />
          }
        },
        {
          title: '基本资料',
          ellipsis: true,
          dataIndex: 'avatar',
          render(_, user) {
            return (
              <Space orientation="vertical">
                <AuthorName user={user} author_type={GeneralAuthorType.User} icon={true} />
                <AuthorEmail
                  user={user}
                  author_type={GeneralAuthorType.User}
                  icon={true}
                  copyable={true}
                />
              </Space>
            )
          }
        },
        {
          title: '社交身份绑定',
          ellipsis: true,
          dataIndex: 'identities',
          render(_, user) {
            return (
              <Space orientation="vertical">
                {getUserIdentityList(user.identities).map((item) => (
                  <UniversalText
                    key={item.provider}
                    prefix={item.icon}
                    text={item.displayId}
                    placeholder="未绑定"
                  />
                ))}
              </Space>
            )
          }
        },
        {
          title: '生命周期',
          width: 250,
          ellipsis: true,
          dataIndex: 'created_at',
          render(_, user) {
            return (
              <Space orientation="vertical">
                <UniversalText prefix="最早创建于" text={stringToYMD(user.created_at!)} />
                <UniversalText
                  prefix="最后修改于"
                  type="secondary"
                  text={stringToYMD(user.updated_at!)}
                />
              </Space>
            )
          }
        },
        {
          title: '操作',
          width: 120,
          dataIndex: 'actions',
          render: (_, user, index) => (
            <Space orientation="vertical">
              <Button
                size="small"
                variant="link"
                color="default"
                block={true}
                icon={<Icons.EditOutlined />}
                onClick={() => props.onDetail(user, index)}
              >
                用户详情
              </Button>
              <Button
                size="small"
                variant="link"
                color="danger"
                block={true}
                icon={<Icons.DeleteOutlined />}
                onClick={() => message.warning('双击执行删除操作')}
                onDoubleClick={() => props.onDelete(user, index)}
              >
                删除用户
              </Button>
            </Space>
          )
        }
      ]}
    />
  )
}
