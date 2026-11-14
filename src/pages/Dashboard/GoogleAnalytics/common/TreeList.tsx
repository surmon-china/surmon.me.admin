import React, { useMemo, useState } from 'react'
import { Button, Flex, Listy, Empty } from 'antd'
import * as Icons from '@ant-design/icons'
import { ReportRowItem } from './helper'
import { UniversalText } from '@/components/common/UniversalText'

import styles from './TreeList.module.less'

export interface TreeListItem {
  name: string
  value: number
  children?: Omit<TreeListItem, 'children'>[]
}

interface TreeListItemNodeProps {
  data: TreeListItem
  totalValue: number
  limit?: number
  defaultExpanded?: boolean
  strongLabel?: boolean
  labelPrefix?: React.ReactNode | ((data: TreeListItem) => React.ReactNode)
  labelSuffix?: React.ReactNode | ((data: TreeListItem) => React.ReactNode)
  renderLabel?(data: TreeListItem): React.ReactNode
}

const TreeListItemNode: React.FC<TreeListItemNodeProps> = (props) => {
  const children = props.data.children ?? []
  const [isExpanded, setExpanded] = useState(props.defaultExpanded ?? true)
  const percent = useMemo(
    () => Math.floor((props.data.value / props.totalValue) * 100),
    [props.data, props.totalValue]
  )

  const renderLabelElement = () => (
    <UniversalText
      text={props.data.name}
      strong={props.strongLabel}
      prefix={
        typeof props.labelPrefix === 'function'
          ? props.labelPrefix?.(props.data)
          : props.labelPrefix
      }
      suffix={
        <>
          {typeof props.labelSuffix === 'function'
            ? props.labelSuffix?.(props.data)
            : props.labelSuffix}
          {!children?.length ? null : (
            <Button
              type="text"
              size="small"
              icon={isExpanded ? <Icons.MinusSquareOutlined /> : <Icons.PlusSquareOutlined />}
              onClick={() => setExpanded(!isExpanded)}
            />
          )}
        </>
      }
    />
  )

  const renderChildrenList = () => (
    <ul className={styles.childList}>
      {children.slice(0, props.limit).map((child) => (
        <li className={styles.childItem} key={child.name}>
          <Flex justify="space-between">
            <UniversalText text={child.name} />
            <UniversalText text={child.value} type="secondary" />
          </Flex>
        </li>
      ))}
      {props.limit && children.length > props.limit && (
        <li className={styles.childItem}>
          <Icons.EllipsisOutlined />
        </li>
      )}
    </ul>
  )

  return (
    <div className={styles.listItem}>
      <div className={styles.listItemPercent}>
        <div className={styles.percentCore} style={{ width: `${percent}%` }}></div>
      </div>
      <Flex justify="space-between">
        {props.renderLabel ? props.renderLabel(props.data) : renderLabelElement()}
        <span>{props.data.value}</span>
      </Flex>
      {children?.length && isExpanded ? renderChildrenList() : null}
    </div>
  )
}

export interface GoogleAnalyticsTreeListProps {
  rows: ReportRowItem[]
  limit?: number
  childrenLimit?: number
  defaultExpanded?: TreeListItemNodeProps['defaultExpanded']
  strongLabel?: TreeListItemNodeProps['strongLabel']
  labelPrefix?: TreeListItemNodeProps['labelPrefix']
  labelSuffix?: TreeListItemNodeProps['labelSuffix']
  renderLabel?: TreeListItemNodeProps['renderLabel']
}

export const GoogleAnalyticsTreeList: React.FC<GoogleAnalyticsTreeListProps> = (props) => {
  const treeList = useMemo<TreeListItem[]>(() => {
    const treeMap = new Map()
    props.rows.forEach((item) => {
      const [parentName, childName] = item.dimensionValues.map((i) => i.value)
      const value = Number(item.metricValues[0].value)
      const parentNode = treeMap.get(parentName) ?? { value: 0 }
      parentNode.value += value
      parentNode.name = parentName
      if (childName) {
        parentNode.children = parentNode.children || []
        parentNode.children.push({
          name: childName,
          value: value
        })
      }
      treeMap.set(parentName, parentNode)
    })
    return [...treeMap.values()]
  }, [props.rows])

  const totalValue = useMemo(
    () => treeList.reduce((accumulator, current) => accumulator + current.value, 0),
    [treeList]
  )

  return treeList.slice(0, props.limit).length ? (
    <Listy
      rowHoverable={false}
      rowKey="name"
      styles={{ item: { padding: 0 } }}
      items={treeList.slice(0, props.limit)}
      itemRender={(item) => (
        <TreeListItemNode
          data={item}
          totalValue={totalValue}
          limit={props.childrenLimit}
          defaultExpanded={props.defaultExpanded}
          strongLabel={props.strongLabel}
          labelPrefix={props.labelPrefix}
          labelSuffix={props.labelSuffix}
          renderLabel={props.renderLabel}
        />
      )}
    />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  )
}
