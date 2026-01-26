import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { SortSelect } from '@/components/common/SortSelect'
import { SortOrder } from '@/constants/sort'
import { AnnouncementStatus, announcementStatuses } from '@/constants/announcement'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  status: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | AnnouncementStatus,
  sort: SortOrder.Desc
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  status: params.status !== SELECT_ALL_VALUE ? params.status : void 0,
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
  const { i18n } = useTranslation()
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Select
          style={{ width: 110 }}
          disabled={props.loading}
          value={props.params.status}
          onChange={(status) => props.onParamsChange({ status })}
          options={[
            { label: '全部状态', value: SELECT_ALL_VALUE },
            ...announcementStatuses.map((status) => ({
              value: status.id,
              label: (
                <Space size="small">
                  {status.icon}
                  {status.name}
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
          style={{ width: 220 }}
          placeholder={i18n.t('common.list.filter.search')}
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
          onClick={() => props.onResetRefresh()}
        >
          {i18n.t('common.list.filter.refresh_with_reset')}
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
