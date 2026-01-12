import React from 'react'
import { useShallowRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Spin, Skeleton, Button, Divider, Space, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import type { Tag } from '@/constants/tag'
import { getAllTags } from '@/apis/tag'

export interface TagSelectProps {
  value?: string[]
  onChange?(value: string[]): void
}

export const TagSelect: React.FC<TagSelectProps> = (props) => {
  const fetching = useLoading()
  const tags = useShallowRef<Tag[]>([])
  const fetchTags = () => {
    fetching.promise(getAllTags()).then((result) => {
      tags.value = result
    })
  }

  const values = props.value || []
  const handleClick = (tag: Tag, checked: boolean) => {
    const tagId = tag._id!
    const tagIds = checked ? [...values, tagId] : values.filter((t) => t !== tagId)
    props.onChange?.(tagIds)
  }

  onMounted(() => {
    fetchTags()
  })

  const renderTagListItem = (tag: Tag) => {
    const isChecked = values.includes(tag._id!)
    return (
      <Button
        size="small"
        key={tag._id!}
        onClick={() => handleClick(tag, !isChecked)}
        type={isChecked ? 'primary' : 'default'}
        icon={
          isChecked ? (
            <Icons.CheckCircleOutlined />
          ) : (
            <Icons.TagOutlined style={{ opacity: 0.6 }} />
          )
        }
      >
        {tag.name} · {tag.slug}
      </Button>
    )
  }

  return (
    <div>
      <Spin spinning={fetching.state.value && !!tags.value.length}>
        <Skeleton
          title={false}
          paragraph={{ rows: 3 }}
          loading={fetching.state.value && !tags.value.length}
        >
          {tags.value.length ? (
            <Space wrap size={[12, 12]}>
              {tags.value.map(renderTagListItem)}
            </Space>
          ) : (
            <Typography.Text type="secondary">无数据</Typography.Text>
          )}
        </Skeleton>
      </Spin>
      <Divider />
      <Button
        size="small"
        type="dashed"
        icon={<Icons.ReloadOutlined />}
        loading={fetching.state.value}
        onClick={fetchTags}
      >
        刷新列表
      </Button>
    </div>
  )
}
