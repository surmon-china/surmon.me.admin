import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SelectWithInput } from '@/components/common/SelectWithInput'
import { SortSelect } from '@/components/common/SortSelect'
import { SortMode } from '@/constants/sort'
import { CommentAuthorType, commentAuthorTypes } from '@/constants/author'
import { CommentTargetType, commentTargetTypes, getCommentTargetType } from '@/constants/comment'
import { CommentStatus, commentStatuses } from '@/constants/comment'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = Object.freeze({
  author_type: SELECT_ALL_VALUE as CommentAuthorType | typeof SELECT_ALL_VALUE,
  target_type: SELECT_ALL_VALUE as CommentTargetType | typeof SELECT_ALL_VALUE,
  target_id: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  status: SELECT_ALL_VALUE as CommentStatus | typeof SELECT_ALL_VALUE,
  sort: SortMode.Latest
})

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  author_type: params.author_type !== SELECT_ALL_VALUE ? params.author_type : void 0,
  target_type: params.target_type !== SELECT_ALL_VALUE ? params.target_type : void 0,
  target_id: params.target_id !== SELECT_ALL_VALUE ? params.target_id : void 0,
  status: params.status !== SELECT_ALL_VALUE ? params.status : void 0,
  sort: params.sort
})

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  onParamsChange(value: Partial<FilterParams>): void
  targetIdInput: string
  onTargetIdInputChange(postId: string): void
  keyword: string
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space orientation="vertical">
        <Space wrap>
          <SelectWithInput
            disabled={props.loading}
            inputStyle={{ width: 130 }}
            inputPlaceholder={
              (props.params.target_type === SELECT_ALL_VALUE
                ? '目标'
                : getCommentTargetType(props.params.target_type).name) + ' ID'
            }
            inputType="number"
            inputValue={props.targetIdInput}
            onInputChange={(value) => props.onTargetIdInputChange(value)}
            onInputSearch={(value) =>
              props.onParamsChange({
                target_id: value ? Number(value) : SELECT_ALL_VALUE
              })
            }
            selectStyle={{ width: 100 }}
            selectValue={props.params.target_type}
            onSelectChange={(target_type) => props.onParamsChange({ target_type })}
            selectOptions={[
              { value: SELECT_ALL_VALUE, label: '全部页面' },
              ...commentTargetTypes.map((type) => ({
                value: type.id,
                label: type.name + '评论'
              }))
            ]}
          />
          <Select
            style={{ width: 120 }}
            disabled={props.loading}
            value={props.params.status}
            onChange={(status) => props.onParamsChange({ status })}
            options={[
              { label: '全部状态', value: SELECT_ALL_VALUE },
              ...commentStatuses.map((status) => ({
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
          <Select
            style={{ width: 100 }}
            disabled={props.loading}
            value={props.params.author_type}
            onChange={(author_type) => props.onParamsChange({ author_type })}
            options={[
              { label: '全部作者', value: SELECT_ALL_VALUE },
              ...commentAuthorTypes.map((type) => ({
                value: type.id,
                label: type.name
              }))
            ]}
          />
          <Input.Search
            style={{ width: 260 }}
            placeholder="输入评论内容、作者信息搜索"
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
        </Space>
        <Space wrap>
          <SortSelect
            style={{ width: 100 }}
            withHot={true}
            disabled={props.loading}
            value={props.params.sort}
            onChange={(sort) => props.onParamsChange({ sort })}
          />
          <Button
            icon={<Icons.ReloadOutlined />}
            loading={props.loading}
            onClick={() => props.onResetRefresh()}
          >
            <Trans i18nKey="common.list.filter.refresh_with_reset" />
          </Button>
        </Space>
      </Space>
      <Space>{props.extra}</Space>
    </Flex>
  )
}
