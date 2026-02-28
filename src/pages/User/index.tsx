/**
 * @file User page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useReactive, useRef, onMounted, useWatch, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { useTranslation } from '@/i18n'
import { Card, Divider, Drawer, Button, Modal, Typography, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/user'
import type { GetUsersParams } from '@/apis/user'
import { ResponsePaginationData } from '@/constants/nodepress'
import { User, UserIdentityProvider } from '@/constants/user'
import { scrollTo } from '@/utils/scroller'
import type { FilterParams } from './ListFilters'
import { ListFilters, DEFAULT_FILTER_PARAMS, getQueryParams } from './ListFilters'
import { TableList } from './TableList'
import { EditForm } from './EditForm'

export const UserPage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const posting = useLoading()
  const identityProcessing = useLoading()
  const users = useReactive<ResponsePaginationData<User>>({
    data: [],
    pagination: void 0
  })

  // select
  const selectedIds = useRef<number[]>([])

  // filters
  const searchKeyword = useRef('')
  const filterParams = useRef<FilterParams>({ ...DEFAULT_FILTER_PARAMS })

  const resetFiltersToDefault = () => {
    searchKeyword.value = ''
    filterParams.value = { ...DEFAULT_FILTER_PARAMS }
  }

  // edit drawer
  const isEditDrawerOpen = useRef(false)
  const activeEditItemIndex = useRef<number | null>(null)
  const activeEditUser = useComputed(() => {
    const index = activeEditItemIndex.value
    return index !== null ? users.data[index] : null
  })

  const closeEditDrawer = () => {
    isEditDrawerOpen.value = false
  }

  const openEditDrawer = (index: number) => {
    activeEditItemIndex.value = index
    isEditDrawerOpen.value = true
  }

  const openCreateDrawer = () => {
    activeEditItemIndex.value = null
    isEditDrawerOpen.value = true
  }

  const fetchList = (params?: GetUsersParams) => {
    const getParams = {
      ...params,
      ...getQueryParams(filterParams.value),
      keyword: searchKeyword.value || void 0
    }

    fetching.promise(api.getUsers(getParams)).then((response) => {
      users.data = response.data
      users.pagination = response.pagination
      scrollTo(document.body)
    })
  }

  const refreshList = () => {
    fetchList({
      page: users.pagination?.current_page,
      per_page: users.pagination?.per_page
    })
  }

  const createUser = (user: User) => {
    posting.promise(api.createUser(user)).then(() => {
      closeEditDrawer()
      refreshList()
    })
  }

  const updateUser = (user: User) => {
    const payload = {
      ...activeEditUser.value,
      ...user
    }

    posting.promise(api.updateUser(payload)).then((result) => {
      if (activeEditItemIndex.value !== null) {
        users.data[activeEditItemIndex.value] = result
      }
    })
  }

  const handleDeleteUser = (user: User) => {
    Modal.confirm({
      title: `确定要彻底删除用户「${user.name}」吗？`,
      content: <Typography.Text type="danger">该行为是物理删除，不可恢复！</Typography.Text>,
      centered: true,
      okType: 'danger',
      onOk: () => {
        return api.deleteUser(user.id).then(() => {
          refreshList()
        })
      }
    })
  }

  const handleRemoveIdentity = (user: User, provider: UserIdentityProvider) => {
    Modal.confirm({
      title: `确定要移除「${user.name}」的 ${provider} 绑定吗？`,
      content: (
        <Space vertical size="small">
          <Typography.Text>移除后，需要用户重新在前台 OAuth 授权绑定。</Typography.Text>
          <Typography.Text type="danger">
            此行为可能导致该账户成为僵尸账户，请谨慎操作！
          </Typography.Text>
        </Space>
      ),
      centered: true,
      okType: 'danger',
      onOk: async () => {
        try {
          identityProcessing.start()
          await api.deleteUserIdentity(user.id, provider)
          const remoteUser = await api.getUser(user.id)
          if (activeEditItemIndex.value !== null) {
            users.data[activeEditItemIndex.value] = remoteUser
          }
        } finally {
          identityProcessing.stop()
        }
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
      title={i18n.t('page.user.list.title', { total: users.pagination?.total ?? '-' })}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<Icons.UserAddOutlined />}
          onClick={openCreateDrawer}
        >
          创建新用户
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
          <Button icon={<Icons.UsergroupDeleteOutlined />} disabled>
            批量操作
          </Button>
        }
      />
      <Divider />
      <TableList
        loading={fetching.state.value}
        data={users.data}
        pagination={users.pagination}
        selectedIds={selectedIds.value}
        onSelect={(ids) => (selectedIds.value = ids)}
        onPaginate={(page, pageSize) => fetchList({ page, per_page: pageSize })}
        onDetail={(_, index) => openEditDrawer(index)}
        onDelete={(user) => handleDeleteUser(user)}
      />
      <Drawer
        size="large"
        title={activeEditUser.value ? '用户详情' : '新用户'}
        destroyOnHidden={true}
        open={isEditDrawerOpen.value}
        onClose={closeEditDrawer}
      >
        <EditForm
          initialData={activeEditUser.value}
          submitting={posting.state.value}
          onSubmit={(user) => (activeEditUser.value ? updateUser(user) : createUser(user))}
          identityProcessing={identityProcessing.state.value}
          onUnlinkIdentity={(user, provider) => handleRemoveIdentity(user, provider)}
        />
      </Drawer>
    </Card>
  )
}
