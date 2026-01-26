/**
 * @file Category page
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { useShallowRef, useRef, onMounted, useComputed } from 'veact'
import { useLoading } from 'veact-use'
import { Button, Card, Divider, Modal, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { Category as Category } from '@/constants/category'
import type { CategoryTree } from '@/apis/category'
import * as api from '@/apis/category'
import { FormModal } from './FormModal'
import { TreeList } from './TreeList'

export const CategoryPage: React.FC = () => {
  const { i18n } = useTranslation()
  const fetching = useLoading()
  const posting = useLoading()
  const categoriesTree = useShallowRef<CategoryTree[]>([])
  const categoriesList = useShallowRef<Category[]>([])

  // modal
  const isFormModalOpen = useRef(false)
  const activeEditCategoryId = useRef<string | null>(null)
  const activeEditCategory = useComputed(() => {
    if (!activeEditCategoryId.value) {
      return null
    }
    return categoriesList.value.find((category) => {
      return category._id === activeEditCategoryId.value
    })!
  })

  const closeModal = () => {
    isFormModalOpen.value = false
  }

  const openEditModal = (id: string) => {
    activeEditCategoryId.value = id
    isFormModalOpen.value = true
  }

  const openCreateModal = () => {
    isFormModalOpen.value = true
    activeEditCategoryId.value = null
  }

  const fetchCategories = () => {
    return fetching.promise(api.getAllCategories()).then((result) => {
      categoriesList.value = result.list
      categoriesTree.value = result.tree
    })
  }

  const createCategory = (category: Category) => {
    posting.promise(api.createCategory(category)).then(() => {
      closeModal()
      fetchCategories()
    })
  }

  const updateCategory = (category: Category) => {
    const payload = {
      ...activeEditCategory.value,
      ...category
    }
    posting.promise(api.updateCategory(payload)).then(() => {
      closeModal()
      fetchCategories()
    })
  }

  const deleteCategory = (category: Category) => {
    Modal.confirm({
      title: `确定要删除分类「${category.name}」吗？`,
      content: '删除后不可恢复',
      centered: true,
      onOk: () => {
        return api.deleteCategory(category._id!).then(() => {
          fetchCategories()
        })
      }
    })
  }

  onMounted(() => fetchCategories())

  return (
    <Card
      variant="borderless"
      title={i18n.t('page.category.list.title', {
        total: categoriesList.value?.length ?? '-'
      })}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<Icons.PlusOutlined />}
          onClick={openCreateModal}
        >
          创建新分类
        </Button>
      }
    >
      <Space>
        <Button
          icon={<Icons.ReloadOutlined />}
          loading={fetching.state.value}
          onClick={() => fetchCategories()}
        >
          {i18n.t('common.list.filter.refresh')}
        </Button>
      </Space>
      <Divider />
      <TreeList
        tree={categoriesTree.value}
        loading={fetching.state.value}
        onEdit={(category) => openEditModal(category._id!)}
        onDelete={(category) => deleteCategory(category)}
      />
      <FormModal
        width={680}
        title={activeEditCategory.value ? '编辑分类' : '新分类'}
        open={isFormModalOpen.value}
        submitting={posting.state.value}
        initData={activeEditCategory.value}
        onCancel={() => closeModal()}
        onSubmit={(category) => {
          activeEditCategory.value ? updateCategory(category) : createCategory(category)
        }}
        selectTree={api.getAntdTreeByTree({
          tree: categoriesTree.value,
          valuer: (category) => category._id,
          disabledWhen: (category) => {
            if (category._id === activeEditCategory.value?._id) {
              return true
            } else if (category.pid === activeEditCategory.value?._id) {
              return true
            } else {
              return false
            }
          }
        })}
      />
    </Card>
  )
}
