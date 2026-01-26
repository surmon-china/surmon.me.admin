import React from 'react'
import * as Icons from '@ant-design/icons'
import { Button, Flex, Select, Input, Space } from 'antd'
import { DisqusPostStatus, DisqusSortOrder } from '@/constants/disqus'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = {
  order: DisqusSortOrder.Desc,
  include: SELECT_ALL_VALUE as any as DisqusPostStatus | typeof SELECT_ALL_VALUE
}

export type FilterParams = typeof DEFAULT_FILTER_PARAMS

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  threadId: string
  onParamsChange(value: Partial<FilterParams>): void
  onThreadIdChange(targetId: string): void
  onThreadIdSearch(): void
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
          value={props.params.include}
          onChange={(include) => props.onParamsChange({ include })}
          options={[
            {
              value: SELECT_ALL_VALUE,
              label: 'All state'
            },
            {
              value: DisqusPostStatus.Approved,
              label: 'Approved'
            },
            {
              value: DisqusPostStatus.Unapproved,
              label: 'Unapproved'
            },
            {
              value: DisqusPostStatus.Spam,
              label: 'Spam'
            },
            {
              value: DisqusPostStatus.Deleted,
              label: 'Deleted'
            },
            {
              value: DisqusPostStatus.Flagged,
              label: 'Flagged'
            },
            {
              value: DisqusPostStatus.Highlighted,
              label: 'Highlighted'
            }
          ]}
        />
        <Select
          style={{ width: 80 }}
          disabled={props.loading}
          value={props.params.order}
          onChange={(order) => props.onParamsChange({ order })}
          options={[
            {
              value: DisqusSortOrder.Desc,
              label: 'Desc'
            },
            {
              value: DisqusSortOrder.Asc,
              label: 'Asc'
            }
          ]}
        />
        <Input.Search
          style={{ width: 180 }}
          allowClear={true}
          placeholder="thread ID"
          disabled={props.loading}
          value={props.threadId}
          onChange={(event) => props.onThreadIdChange(event.target.value.trim())}
          onSearch={(_, __, info) => {
            if (info?.source === 'input') {
              props.onThreadIdSearch()
            }
          }}
        />
        <Button
          loading={props.loading}
          icon={<Icons.ReloadOutlined />}
          onClick={() => props.onResetRefresh()}
        >
          Reset and refresh
        </Button>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
