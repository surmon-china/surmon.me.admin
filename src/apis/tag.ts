/**
 * @file Tag
 * @author Surmon <https://github.com/surmon-china>
 */

import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/nodepress'
import { Tag } from '@/constants/tag'
import nodepress from '@/services/nodepress'

export const TAG_API_PATH = '/tags'

/** 获取标签参数 */
export interface GetTagParams extends GeneralPaginateQueryParams {
  /** 搜索关键词 */
  keyword?: string
}

/** 获取标签列表 */
export function getTags(params: GetTagParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Tag>>(TAG_API_PATH, { params })
    .then((response) => response.result)
}

/** 获取所有标签 */
export function getAllTags() {
  return nodepress.get<Tag[]>(`${TAG_API_PATH}/all`).then((response) => response.result)
}

/** 创建标签 */
export function createTag(tag: Tag) {
  return nodepress.post(TAG_API_PATH, tag).then((response) => response.result)
}

/** 修改标签 */
export function updateTag(tag: Tag) {
  return nodepress.patch(`${TAG_API_PATH}/${tag.id}`, tag).then((response) => response.result)
}

/** 删除标签 */
export function deleteTag(tagId: number) {
  return nodepress.delete(`${TAG_API_PATH}/${tagId}`).then((response) => response.result)
}

/** 批量删除标签 */
export function deleteTags(tagIds: number[]) {
  return nodepress
    .delete(TAG_API_PATH, { data: { tag_ids: tagIds } })
    .then((response) => response.result)
}
