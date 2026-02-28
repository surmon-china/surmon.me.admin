import React from 'react'
import { useShallowRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import * as Icons from '@ant-design/icons'
import { Spin, Skeleton, Button, Tree, Typography, Divider, Space } from 'antd'
import { getAllCategories, CategoryTree, getAntdTreeByTree } from '@/apis/category'

import styles from './style.module.less'

export interface CategoryTreeSelectProps {
  value?: string[]
  onChange?(value: string[]): void
}

export const CategoryTreeSelect: React.FC<CategoryTreeSelectProps> = (props) => {
  const fetching = useLoading()
  const categories = useShallowRef<CategoryTree[]>([])
  const fetchCategories = () => {
    fetching.promise(getAllCategories()).then((result) => {
      categories.value = result.tree
    })
  }

  onMounted(() => {
    fetchCategories()
  })

  const renderTreeList = () => (
    <Tree
      className={styles.categorySelect}
      virtual={false}
      showIcon={false}
      showLine={true}
      checkable={true}
      blockNode={true}
      defaultExpandAll={true}
      checkStrictly={true}
      checkedKeys={props.value}
      onCheck={(data) => {
        const ids = Array.isArray(data) ? data : data.checked
        props.onChange?.(ids as string[])
      }}
      treeData={getAntdTreeByTree({
        tree: categories.value,
        valuer: (category) => category._id
      })}
      titleRender={(nodeData) => {
        const category: CategoryTree = (nodeData as any).data
        return (
          <Space size="small">
            <Typography.Text strong={true}>{category.name}</Typography.Text>
            <Divider orientation="vertical" />
            {category.slug}
          </Space>
        )
      }}
    />
  )

  return (
    <div>
      <Spin spinning={fetching.state.value && !!categories.value.length}>
        <Skeleton
          title={false}
          paragraph={{ rows: 5 }}
          loading={fetching.state.value && !categories.value.length}
        >
          {categories.value.length ? (
            renderTreeList()
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
        onClick={fetchCategories}
      >
        刷新列表
      </Button>
    </div>
  )
}
