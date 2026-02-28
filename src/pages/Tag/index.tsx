/**
 * @file Tag page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowReactive, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Divider, Modal } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/tag'
import type { GetTagParams } from '@/apis/tag'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { ResponsePaginationData } from '@/constants/nodepress'
import { Tag } from '@/constants/tag'
import { useTranslation } from '@/i18n'
import { scrollTo } from '@/utils/scroller'
import { ListFilters } from './ListFilters'
import { TableList } from './TableList'
import { FormModal } from './FormModal'

export const TagPage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const posting = useLoading()
  const tags = useShallowReactive<ResponsePaginationData<Tag>>({
    data: [],
    pagination: void 0
  })

  // filters
  const searchKeyword = useRef('')

  // select
  const selectedIds = useRef<number[]>([])

  // form modal
  const isFormModalOpen = useRef(false)
  const activeEditTagIndex = useRef<number | null>(null)
  const activeEditTag = useComputed(() => {
    const index = activeEditTagIndex.value
    return index !== null ? tags.data[index] : null
  })

  const closeModal = () => {
    isFormModalOpen.value = false
  }

  const openEditModal = (index: number) => {
    activeEditTagIndex.value = index
    isFormModalOpen.value = true
  }

  const openCreateModal = () => {
    activeEditTagIndex.value = null
    isFormModalOpen.value = true
  }

  const fetchList = (params?: GetTagParams) => {
    const getParams = {
      ...params,
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(api.getTags(getParams)).then((response) => {
      tags.data = response.data
      tags.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: tags.pagination?.current_page,
      per_page: tags.pagination?.per_page
    })
  }

  const createTag = (tag: Tag) => {
    posting.promise(api.createTag(tag)).then(() => {
      closeModal()
      refreshList()
    })
  }

  const updateTag = (tag: Tag) => {
    const payload = {
      ...activeEditTag.value,
      ...tag
    }

    posting.promise(api.updateTag(payload)).then(() => {
      closeModal()
      refreshList()
    })
  }

  const deleteTag = (tag: Tag) => {
    Modal.confirm({
      title: `确定要删除标签「${tag.name}」吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return api.deleteTag(tag.id).then(() => {
          refreshList()
        })
      }
    })
  }

  const deleteTags = (tagIds: number[]) => {
    Modal.confirm({
      title: `确定要删除 ${tagIds.length} 个标签吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return api.deleteTags(tagIds).then(() => {
          refreshList()
        })
      }
    })
  }

  const resetParamsAndRefresh = () => {
    searchKeyword.value = ''
    fetchList()
  }

  onMounted(() => {
    fetchList()
  })

  return (
    <Card
      variant="borderless"
      title={i18n.t('page.tag.list.title', { total: tags.pagination?.total ?? '-' })}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<Icons.PlusOutlined />}
          onClick={openCreateModal}
        >
          创建新标签
        </Button>
      }
    >
      <ListFilters
        loading={fetching.state.value}
        keyword={searchKeyword.value}
        onKeywordChange={(keyword) => (searchKeyword.value = keyword)}
        onKeywordSearch={() => fetchList()}
        onResetRefresh={resetParamsAndRefresh}
        extra={
          <DropdownMenu
            text="批量操作"
            disabled={!selectedIds.value.length}
            options={[
              {
                label: '批量删除',
                icon: <Icons.DeleteOutlined />,
                onClick: () => deleteTags(selectedIds.value)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        data={tags.data}
        pagination={tags.pagination}
        selectedIds={selectedIds.value}
        onSelect={(ids) => (selectedIds.value = ids)}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
        onEdit={(_, index) => openEditModal(index)}
        onDelete={(tag) => deleteTag(tag)}
      />
      <FormModal
        width={680}
        title={activeEditTag.value ? '编辑标签' : '新标签'}
        submitting={posting.state.value}
        open={isFormModalOpen.value}
        initialData={activeEditTag.value}
        onCancel={closeModal}
        onSubmit={(tag) => (activeEditTag.value ? updateTag(tag) : createTag(tag))}
      />
    </Card>
  )
}
