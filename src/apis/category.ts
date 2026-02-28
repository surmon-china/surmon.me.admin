/**
 * @file Category
 * @author Surmon <https://github.com/surmon-china>
 */

import type { TreeDataNode } from 'antd'
import { arrayToTree } from 'performant-array-to-tree'
import { Category } from '@/constants/category'
import nodepress from '@/services/nodepress'

export const CATEGORY_API_PATH = '/categories'

export interface CategoryTree extends Category {
  children?: CategoryTree[]
}

/** 获取全部分类列表 */
export function getAllCategories() {
  return nodepress.get<Category[]>(`${CATEGORY_API_PATH}/all`).then((response) => ({
    list: response.result,
    tree: arrayToTree(response.result, {
      id: 'id',
      parentId: 'parent_id',
      childrenField: 'children',
      dataField: null
    }) as CategoryTree[]
  }))
}

/** 获取符合 Antd Tree 结构的分类树 */
export function getAntdTreeByTree(options: {
  tree: CategoryTree[]
  valuer(category: Category): any
  disabledWhen?(category: Category): boolean
}) {
  const toAntdTree = (_tree: CategoryTree[]): TreeDataNode[] => {
    return _tree.map((_category) => ({
      data: _category,
      title: _category.name,
      key: options.valuer(_category),
      value: options.valuer(_category),
      disabled: options.disabledWhen?.(_category) ?? false,
      children: toAntdTree(_category.children || [])
    }))
  }
  return toAntdTree(options.tree)
}

/** 创建分类 */
export function createCategory(category: Category) {
  return nodepress.post(CATEGORY_API_PATH, category).then((response) => response.result)
}

/** 修改分类 */
export function updateCategory(category: Category) {
  return nodepress
    .patch(`${CATEGORY_API_PATH}/${category.id}`, category)
    .then((response) => response.result)
}

/** 删除分类 */
export function deleteCategory(categoryId: number) {
  return nodepress
    .delete(`${CATEGORY_API_PATH}/${categoryId}`)
    .then((response) => response.result)
}

/** 批量删除分类 */
export function deleteCategories(categorie_ids: number[]) {
  return nodepress
    .delete(CATEGORY_API_PATH, { data: { categorie_ids } })
    .then((response) => response.result)
}
