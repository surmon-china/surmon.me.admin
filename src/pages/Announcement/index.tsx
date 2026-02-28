/**
 * @file Announcement page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useLoading } from 'veact-use'
import { useShallowReactive, useRef, onMounted, useWatch, useComputed } from 'veact'
import { Button, Card, Divider, Modal } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/announcement'
import type { GetAnnouncementsParams } from '@/apis/announcement'
import { useTranslation } from '@/i18n'
import { DropdownMenu } from '@/components/common/DropdownMenu'
import { ResponsePaginationData } from '@/constants/nodepress'
import { Announcement } from '@/constants/announcement'
import { scrollTo } from '@/utils/scroller'
import { ListFilters, DEFAULT_FILTER_PARAMS, FilterParams, getQueryParams } from './ListFilters'
import { TableList } from './TableList'
import { FormModal } from './FormModal'

export const AnnouncementPage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const posting = useLoading()
  const announcements = useShallowReactive<ResponsePaginationData<Announcement>>({
    data: [],
    pagination: undefined
  })

  // filters
  const searchKeyword = useRef('')
  const filterParams = useRef<FilterParams>({ ...DEFAULT_FILTER_PARAMS })

  const resetFiltersToDefault = () => {
    searchKeyword.value = ''
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  // select
  const selectedIds = useRef<number[]>([])

  // modal
  const isFormModalOpen = useRef(false)
  const activeEditItemIndex = useRef<number | null>(null)
  const activeEditAnnouncement = useComputed(() => {
    const index = activeEditItemIndex.value
    return index !== null ? announcements.data[index] : null
  })

  const closeModal = () => {
    isFormModalOpen.value = false
  }

  const openEditModal = (index: number) => {
    activeEditItemIndex.value = index
    isFormModalOpen.value = true
  }

  const openCreateModal = () => {
    activeEditItemIndex.value = null
    isFormModalOpen.value = true
  }

  const fetchList = (params?: GetAnnouncementsParams) => {
    const getParams: GetAnnouncementsParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(api.getAnnouncements(getParams)).then((response) => {
      announcements.data = response.data
      announcements.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: announcements.pagination?.current_page,
      per_page: announcements.pagination?.per_page
    })
  }

  const createAnnouncement = (announcement: Announcement) => {
    posting.promise(api.createAnnouncement(announcement)).then(() => {
      closeModal()
      refreshList()
    })
  }

  const updateAnnouncement = (announcement: Announcement) => {
    const payload = {
      ...activeEditAnnouncement.value,
      ...announcement
    }

    posting.promise(api.updateAnnouncement(payload)).then(() => {
      closeModal()
      refreshList()
    })
  }

  const deleteAnnouncement = (id: number) => {
    Modal.confirm({
      title: '确定要删除这个公告吗？',
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return api.deleteAnnouncement(id).then(() => {
          refreshList()
        })
      }
    })
  }

  const deleteAnnouncements = (ids: number[]) => {
    Modal.confirm({
      title: `确定要删除 ${ids.length} 个公告吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return api.deleteAnnouncements(ids).then(() => {
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
      title={i18n.t('page.announcement.list.title', {
        total: announcements.pagination?.total ?? '-'
      })}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<Icons.PlusOutlined />}
          onClick={openCreateModal}
        >
          发布新公告
        </Button>
      }
    >
      <ListFilters
        loading={fetching.state.value}
        keyword={searchKeyword.value}
        onKeywordChange={(keyword) => (searchKeyword.value = keyword)}
        onKeywordSearch={() => fetchList()}
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
                onClick: () => deleteAnnouncements(selectedIds.value)
              }
            ]}
          />
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        data={announcements.data}
        pagination={announcements.pagination}
        selectedIds={selectedIds.value}
        onSelect={(ids) => (selectedIds.value = ids)}
        onEdit={(_, index) => openEditModal(index)}
        onDelete={(announcement) => deleteAnnouncement(announcement.id)}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
      />
      <FormModal
        width={680}
        title={activeEditAnnouncement.value ? '编辑公告' : '新公告'}
        open={isFormModalOpen.value}
        submitting={posting.state.value}
        initialData={activeEditAnnouncement.value}
        onCancel={closeModal}
        onSubmit={(announcement) => {
          activeEditAnnouncement.value
            ? updateAnnouncement(announcement)
            : createAnnouncement(announcement)
        }}
      />
    </Card>
  )
}
