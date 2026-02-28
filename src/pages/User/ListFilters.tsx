import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SortSelect } from '@/components/common/SortSelect'
import { SortOrder } from '@/constants/sort'
import { UserType, userTypes } from '@/constants/user'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  type: SELECT_ALL_VALUE as UserType | typeof SELECT_ALL_VALUE,
  sort: SortOrder.Desc
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  type: params.type !== SELECT_ALL_VALUE ? params.type : void 0,
  sort: params.sort
})

export interface ListFiltersProps {
  loading: boolean
  keyword: string
  params: FilterParams
  onParamsChange(value: Partial<FilterParams>): void
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Select
          style={{ width: 120 }}
          disabled={props.loading}
          value={props.params.type}
          onChange={(type) => props.onParamsChange({ type })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有类型' },
            ...userTypes.map((type) => ({
              value: type.id,
              label: (
                <Space size="small">
                  {type.icon}
                  {type.name}
                </Space>
              )
            }))
          ]}
        />
        <SortSelect
          style={{ width: 110 }}
          disabled={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Input.Search
          style={{ width: 320 }}
          placeholder="输入用户的名字、邮箱、网站 进行搜索"
          disabled={props.loading}
          value={props.keyword}
          onChange={(event) => props.onKeywordChange(event.target.value)}
          allowClear={true}
          onSearch={(_, __, info) => {
            if (info?.source === 'input') {
              props.onKeywordSearch()
            }
          }}
        />
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={props.loading}
          onClick={props.onResetRefresh}
        >
          <span>
            <Trans i18nKey="common.list.filter.refresh_with_reset" />
          </span>
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
