import React from 'react'
import { Button, Input, Select, Space, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { Trans } from '@/i18n'
import { SelectWithInput } from '@/components/common/SelectWithInput'
import { SortSelect } from '@/components/common/SortSelect'
import { SortMode } from '@/constants/sort'
import { CommentStatus, commentStatuses, COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'

export const SELECT_ALL_VALUE = 'ALL'
export const DEFAULT_FILTER_PARAMS = Object.freeze({
  postId: SELECT_ALL_VALUE as number | typeof SELECT_ALL_VALUE,
  status: SELECT_ALL_VALUE as typeof SELECT_ALL_VALUE | CommentStatus,
  sort: SortMode.Latest
})

export type FilterParams = typeof DEFAULT_FILTER_PARAMS
export const getQueryParams = (params: FilterParams) => ({
  post_id: params.postId !== SELECT_ALL_VALUE ? params.postId : void 0,
  status: params.status !== SELECT_ALL_VALUE ? params.status : void 0,
  sort: params.sort
})

export interface ListFiltersProps {
  loading: boolean
  params: FilterParams
  onParamsChange(value: Partial<FilterParams>): void
  postIdInput: string
  onPostIdInputChange(postId: string): void
  keyword: string
  onKeywordChange(keyword: string): void
  onKeywordSearch(): void
  onResetRefresh(): void
  extra?: React.ReactNode
}

export const ListFilters: React.FC<ListFiltersProps> = (props) => {
  return (
    <Flex justify="space-between" gap="middle" wrap>
      <Space wrap>
        <SelectWithInput
          disabled={props.loading}
          inputStyle={{ width: 130 }}
          inputPlaceholder="POST ID"
          inputType="number"
          inputValue={props.postIdInput}
          onInputChange={(value) => props.onPostIdInputChange(value)}
          onInputSearch={(value) => {
            const postId = value ? Number(value) : SELECT_ALL_VALUE
            props.onParamsChange({ postId })
          }}
          selectStyle={{ width: 110 }}
          selectValue={props.params.postId}
          onSelectChange={(postId) => {
            props.onPostIdInputChange(postId === SELECT_ALL_VALUE ? '' : String(postId))
            props.onParamsChange({ postId })
          }}
          selectLabelRender={({ label }) => label || '文章评论'}
          selectOptions={[
            { value: SELECT_ALL_VALUE, label: '全部评论' },
            { value: COMMENT_GUESTBOOK_POST_ID, label: '留言评论' }
          ]}
        />
        <Select
          style={{ width: 130 }}
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
        <SortSelect
          style={{ width: 100 }}
          withHot={true}
          disabled={props.loading}
          value={props.params.sort}
          onChange={(sort) => props.onParamsChange({ sort })}
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
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={props.loading}
          onClick={() => props.onResetRefresh()}
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
