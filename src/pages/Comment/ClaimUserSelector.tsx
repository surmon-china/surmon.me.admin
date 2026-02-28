import React from 'react'
import { useShallowRef } from 'veact'
import { useLoading } from 'veact-use'
import { Input, Typography, List, Card, Space, message, Avatar } from 'antd'
import * as Icons from '@ant-design/icons'
import { APP_PRIMARY_COLOR } from '@/config'
import { Comment } from '@/constants/comment'
import { User } from '@/constants/user'
import * as userApi from '@/apis/user'

interface ClaimUserSelectorProps {
  comments: Comment[]
  onChange(userId: number | null): void
}

export const ClaimUserSelector: React.FC<ClaimUserSelectorProps> = ({ comments, onChange }) => {
  const loading = useLoading()
  const searchedUser = useShallowRef<User | null>(null)
  const selectedId = useShallowRef<number | null>(null)

  const handleSearch = async (value: string) => {
    const targetId = Number(value)
    if (!targetId) {
      message.warning('请输入有效的用户 ID')
      return
    }

    try {
      const user = await loading.promise(userApi.getUser(targetId))
      searchedUser.value = user
      selectedId.value = null
      onChange(null)
    } catch (error) {
      message.error('未找到该用户，请检查 ID')
      searchedUser.value = null
      onChange(null)
    }
  }

  const handleSelect = () => {
    if (searchedUser.value) {
      selectedId.value = searchedUser.value.id
      onChange(searchedUser.value.id)
    }
  }

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Text type="secondary">
          只有无用户归属的评论可以被认领，将尝试把以下 {comments.length} 条评论认领给指定用户：
        </Typography.Text>
        <List
          size="small"
          dataSource={comments}
          style={{ maxHeight: 280, overflow: 'auto', marginTop: 8 }}
          renderItem={(item) => (
            <List.Item style={{ padding: '4px 0', border: 'none' }}>
              <Typography.Text ellipsis style={{ width: '100%' }} title={item.content}>
                <Typography.Text strong>[{item.author_name || '匿名'}]</Typography.Text>{' '}
                {item.content}
              </Typography.Text>
            </List.Item>
          )}
        />
      </div>
      <Input.Search
        placeholder="请输入目标用户 ID，按回车或点击搜索"
        enterButton="搜索用户"
        type="number"
        loading={loading.state.value}
        onSearch={handleSearch}
      />
      {searchedUser.value && (
        <Card size="small" hoverable={true} onClick={handleSelect}>
          <Card.Meta
            avatar={
              <Avatar
                src={searchedUser.value.avatar_url}
                icon={<Icons.UserOutlined />}
                size={50}
              />
            }
            title={
              <Space>
                {searchedUser.value.name}
                {selectedId.value === searchedUser.value.id && (
                  <Icons.CheckCircleFilled style={{ color: APP_PRIMARY_COLOR }} />
                )}
              </Space>
            }
            description={searchedUser.value.email || '无邮箱'}
          />
        </Card>
      )}
    </Space>
  )
}
