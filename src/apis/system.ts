/**
 * @file System
 * @author Surmon <https://github.com/surmon-china>
 */

import _isNumber from 'lodash/isNumber'
import nodepress from '@/services/nodepress'
import { Options } from '@/constants/options'

export const OPTIONS_API_PATH = '/options'
export const ARCHIVE_API_PATH = '/archive'
export const SYSTEM_API_PATHS = {
  STATISTICS: '/system/statistics',
  DATA_BASE_BACKUP: '/system/database-backup'
}

export interface Statistics {
  [key: string]: number
}

/** 获取全站统计信息 */
export function getStatistics() {
  return nodepress
    .get<Statistics>(SYSTEM_API_PATHS.STATISTICS)
    .then((response) => response.result)
}

export interface StatisticsCalendarItem {
  date: string
  count: number
}

/** 获取文章创作日历信息 */
export function getArticlesCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<StatisticsCalendarItem[]>('/article/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** 获取评论创建日历信息 */
export function getCommentsCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<StatisticsCalendarItem[]>('/comment/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** 更新 Archive 缓存 */
export function updateArchiveCache() {
  return nodepress.patch<void>(ARCHIVE_API_PATH).then((response) => response.result)
}

/** 更新数据库备份 */
export function updateDatabaseBackup() {
  return nodepress.patch(SYSTEM_API_PATHS.DATA_BASE_BACKUP).then((response) => response.result)
}

/** 获取系统配置 */
export function getOptions() {
  return nodepress.get<Options>(OPTIONS_API_PATH).then((response) => response.result)
}

/** 更新系统配置 */
export function putOptions(options: Options) {
  return nodepress.put<Options>(OPTIONS_API_PATH, options).then((response) => response.result)
}
