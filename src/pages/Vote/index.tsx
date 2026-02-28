/**
 * @file Vote page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, useRef, onMounted, useWatch, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Card, Divider, Modal } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/vote'
import type { GetVotesParams } from '@/apis/vote'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { ResponsePaginationData } from '@/constants/nodepress'
import { Vote } from '@/constants/vote'
import { useTranslation } from '@/i18n'
import { scrollTo } from '@/utils/scroller'
import { FilterTargetId, DEFAULT_TARGET_ID } from './ListFilters'
import { ListFilters, getQueryParams, DEFAULT_FILTER_PARAMS } from './ListFilters'
import { TableList } from './TableList'

export const VotePage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const votes = useShallowReactive<ResponsePaginationData<Vote>>({
    data: [],
    pagination: void 0
  })

  // filters
  const filterParams = useRef({ ...DEFAULT_FILTER_PARAMS })
  const filterTargetId = useRef<FilterTargetId>(void 0)
  const setFilterTargetId = (id: number | void | undefined) => {
    filterTargetId.value = Number.isFinite(id) ? (id as number) : void 0
  }

  const resetFiltersToDefault = () => {
    filterTargetId.value = DEFAULT_TARGET_ID
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  const resetFiltersToTargetId = (vote: Vote) => {
    filterTargetId.value = vote.target_id
    filterParams.value = {
      ...DEFAULT_FILTER_PARAMS,
      target_type: vote.target_type
    }
  }

  // select
  const selectedIds = useRef<number[]>([])
  const selectedVotes = useComputed(() => {
    return votes.data.filter((vote) => selectedIds.value.includes(vote.id))
  })

  const fetchList = (params?: GetVotesParams) => {
    const getParams: GetVotesParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      target_id: filterTargetId.value
    }

    fetching.promise(api.getVotes(getParams)).then((response) => {
      votes.data = response.data
      votes.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: votes.pagination?.current_page,
      per_page: votes.pagination?.per_page
    })
  }

  const deleteItems = (votes: Vote[]) => {
    Modal.confirm({
      title: `确定要彻底删除 ${votes.length} 个记录吗？`,
      content: '该行为是物理删除，不可恢复！',
      centered: true,
      onOk: () => {
        return api.deleteVotes(votes.map((vote) => vote.id)).then(() => {
          refreshList()
        })
      }
    })
  }

  useWatch(
    () => filterParams.value,
    () => fetchList(),
    { deep: true }
  )

  onMounted(() => {
    fetchList()
  })

  return (
    <Card
      variant="borderless"
      title={i18n.t('page.vote.list.title', { total: votes.pagination?.total ?? '-' })}
    >
      <ListFilters
        loading={fetching.state.value}
        targetId={filterTargetId.value}
        onTargetIdChange={setFilterTargetId}
        onTargetIdSearch={() => fetchList()}
        params={filterParams.value}
        onParamsChange={(value) => Object.assign(filterParams.value, value)}
        onResetRefresh={resetFiltersToDefault}
        extra={
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '彻底删除',
                icon: <Icons.DeleteOutlined />,
                onClick: () => deleteItems(selectedVotes.value)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        selectedIds={selectedIds.value}
        data={votes.data}
        pagination={votes.pagination!}
        onSelecte={(ids) => (selectedIds.value = ids)}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
        onClickTarget={(vote) => resetFiltersToTargetId(vote)}
      />
    </Card>
  )
}
