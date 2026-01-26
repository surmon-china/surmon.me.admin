/**
 * @file Announcement
 * @author Surmon <https://github.com/surmon-china>
 */

import { Announcement, AnnouncementStatus } from '@/constants/announcement'
import { ResponsePaginationData, GeneralPaginateQueryParams } from '@/constants/nodepress'
import nodepress from '@/services/nodepress'

export const ANNOUNCEMENT_API_PATH = '/announcement'

/** 获取公告参数 */
export interface GetAnnouncementsParams extends GeneralPaginateQueryParams {
  /** 搜索关键词 */
  keyword?: string
  /** 发布状态 */
  status?: AnnouncementStatus
}

/** 获取公告列表 */
export function getAnnouncements(params: GetAnnouncementsParams = {}) {
  return nodepress
    .get<ResponsePaginationData<Announcement>>(ANNOUNCEMENT_API_PATH, { params })
    .then((response) => response.result)
}

/** 添加公告 */
export function createAnnouncement(announcement: Announcement): Promise<any> {
  return nodepress
    .post<Announcement>(ANNOUNCEMENT_API_PATH, announcement)
    .then((response) => response.result)
}

/** 更新公告 */
export function updateAnnouncement(announcement: Announcement): Promise<any> {
  return nodepress
    .put<Announcement>(`${ANNOUNCEMENT_API_PATH}/${announcement._id}`, announcement)
    .then((response) => response.result)
}

/** 删除公告 */
export function deleteAnnouncement(id: string) {
  return nodepress
    .delete<Announcement>(`${ANNOUNCEMENT_API_PATH}/${id}`)
    .then((response) => response.result)
}

/** 批量删除公告 */
export function deleteAnnouncements(ids: string[]) {
  return nodepress
    .delete<any>(ANNOUNCEMENT_API_PATH, { data: { announcement_ids: ids } })
    .then((response) => response.result)
}
