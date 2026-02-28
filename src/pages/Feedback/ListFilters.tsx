import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { GeneralAuthorType, generalAuthorTypes } from '@/constants/author'
import { SortOrder } from '@/constants/sort'
import { SortSelect } from '@/components/common/SortSelect'
import { MarkedState } from '@/constants/feedback'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  marked: false as boolean,
  emotion: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  author_type: SELECT_ALL_VALUE as GeneralAuthorType | typeof SELECT_ALL_VALUE,
  sort: SortOrder.Desc
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  marked: params.marked ? MarkedState.Yes : void 0,
  emotion: params.emotion !== SELECT_ALL_VALUE ? params.emotion : void 0,
  author_type: params.author_type !== SELECT_ALL_VALUE ? params.author_type : void 0,
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
        <Button
          disabled={props.loading}
          type={props.params.marked ? 'primary' : 'default'}
          icon={props.params.marked ? <Icons.StarFilled /> : <Icons.StarOutlined />}
          onClick={() => props.onParamsChange({ marked: !props.params.marked })}
        >
          标记数据
        </Button>
        <Select
          disabled={props.loading}
          style={{ width: 110 }}
          value={props.params.author_type}
          onChange={(author_type) => props.onParamsChange({ author_type })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有作者' },
            ...generalAuthorTypes.map((type) => ({
              value: type.id,
              label: type.name
            }))
          ]}
        />
        <Select
          style={{ width: 110 }}
          disabled={props.loading}
          value={props.params.emotion}
          onChange={(emotion) => props.onParamsChange({ emotion })}
          options={[
            { value: SELECT_ALL_VALUE, label: '所有评分' },
            { value: 1, label: '1 分' },
            { value: 2, label: '2 分' },
            { value: 3, label: '3 分' },
            { value: 4, label: '4 分' },
            { value: 5, label: '5 分' }
          ]}
        />
        <SortSelect
          style={{ width: 110 }}
          disabled={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
        />
        <Input.Search
          style={{ width: 260 }}
          placeholder="输入反馈内容、作者信息搜索"
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
