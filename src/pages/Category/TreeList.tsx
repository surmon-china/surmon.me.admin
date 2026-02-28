import React from 'react'
import { Button, Divider, Space, Flex, List, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { Category as CategoryType } from '@/constants/category'
import { CategoryTree } from '@/apis/category'
import { getBlogCategoryUrl } from '@/transforms/url'

import styles from './style.module.less'

export interface TreeListProps {
  loading: boolean
  tree: CategoryTree[]
  onEdit(category: CategoryType): void
  onDelete(category: CategoryType): void
  level?: number
}

export const TreeList: React.FC<TreeListProps> = (props) => {
  return (
    <List
      split={false}
      itemLayout="horizontal"
      loading={props.loading}
      dataSource={props.tree}
      renderItem={(category) => (
        <div style={{ paddingLeft: (props.level ?? 0) * 3 + 'rem' }}>
          <Flex justify="space-between" align="start" className={styles.categoryTreeNode}>
            {props.level && (
              <div className={styles.levelIcon}>
                <Icons.LineOutlined />
              </div>
            )}
            <Space orientation="vertical">
              <Space size="small">
                <Typography.Text strong={true}>{category.name}</Typography.Text>
                <Divider orientation="vertical" />
                <Typography.Text type="secondary">{category.slug}</Typography.Text>
                <Divider orientation="vertical" />
                <Typography.Text type="secondary">{category.article_count} 篇</Typography.Text>
              </Space>
              <UniversalText type="secondary" text={category.description} />
            </Space>
            <div className={styles.actions}>
              <Button
                size="small"
                color="default"
                variant="link"
                icon={<Icons.EditOutlined />}
                onClick={() => props.onEdit(category)}
              >
                编辑
              </Button>
              <Divider orientation="vertical" />
              <Button
                size="small"
                color="danger"
                variant="link"
                danger={true}
                icon={<Icons.DeleteOutlined />}
                onClick={() => props.onDelete(category)}
              >
                删除
              </Button>
              <Divider orientation="vertical" />
              <Button
                size="small"
                icon={<Icons.ExportOutlined />}
                type="link"
                target="_blank"
                href={getBlogCategoryUrl(category.slug)}
              >
                查看
              </Button>
            </div>
          </Flex>
          {category.children?.length ? (
            <TreeList
              loading={false}
              level={(props.level ?? 0) + 1}
              tree={category.children}
              onEdit={props.onEdit}
              onDelete={props.onDelete}
            />
          ) : null}
        </div>
      )}
    />
  )
}
