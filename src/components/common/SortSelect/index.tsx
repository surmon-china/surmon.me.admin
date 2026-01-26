/**
 * @desc Sort select
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Select, Space } from 'antd'
import { getSortMode, SortOrder, SortMode } from '@/constants/sort'

export interface SortSelectProps {
  value?: number
  onChange?(value: number): void
  withHot?: boolean
  loading?: boolean
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export const SortSelect: React.FC<SortSelectProps> = (props) => {
  const basicOptions = [SortOrder.Desc, SortOrder.Asc]
  const sortOptions = props.withHot ? [...basicOptions, SortMode.Hottest] : basicOptions

  return (
    <Select
      className={props.className}
      style={props.style}
      loading={props.loading}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
      options={sortOptions.map((sortId) => {
        return {
          value: sortId,
          label: (
            <Space size="small">
              {getSortMode(sortId).icon}
              {getSortMode(sortId).name}
            </Space>
          )
        }
      })}
    />
  )
}
