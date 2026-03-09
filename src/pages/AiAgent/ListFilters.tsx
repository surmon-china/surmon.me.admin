import React from 'react'
import { Button, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import type { GetSessionsParams } from '@/apis/ai-agent'

export const SELECT_NIL_VALUE = 'NIL'
export const DEFAULT_FILTER_PARAMS = {
  sort_field: SELECT_NIL_VALUE as GetSessionsParams['sort_field'],
  sort_order: 'desc' as GetSessionsParams['sort_order']
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  sort_field: params.sort_field !== (SELECT_NIL_VALUE as any) ? params.sort_field : void 0,
  sort_order: params.sort_order
})

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  onParamsChange(value: Partial<FilterParams>): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <Space.Compact>
          <Select
            style={{ width: 130 }}
            disabled={props.loading}
            value={props.params.sort_field}
            onChange={(sort_field) => props.onParamsChange({ sort_field })}
            options={[
              { value: SELECT_NIL_VALUE, label: '默认排序' },
              { value: 'last_active', label: '最后对话时间' },
              { value: 'message_count', label: '对话消息总数' },
              { value: 'total_tokens', label: 'Token 总用量' }
            ]}
          />
          <Select
            style={{ width: 80 }}
            disabled={props.loading}
            value={props.params.sort_order}
            onChange={(sort_order) => props.onParamsChange({ sort_order })}
            options={[
              { value: 'asc', label: '正序' },
              { value: 'desc', label: '倒序' }
            ]}
          />
        </Space.Compact>
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
