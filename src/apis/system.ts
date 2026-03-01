/**
 * @file System
 * @author Surmon <https://github.com/surmon-china>
 */

import nodepress from '@/services/nodepress'
import { Options } from '@/constants/options'

export const OPTIONS_API_PATH = '/options'
export const STATISTICS_API_PATH = '/system/statistics'
export const DATA_BASE_BACKUP_API_PATH = '/system/database-backup'

export interface Statistics {
  [key: string]: number
}

/** 获取全站统计信息 */
export function getStatistics() {
  return nodepress.get<Statistics>(STATISTICS_API_PATH).then((response) => response.result)
}

export interface StatisticsCalendarItem {
  date: string
  count: number
}

/** 获取文章创作日历信息 */
export function getArticlesCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<StatisticsCalendarItem[]>('/articles/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** 获取评论创建日历信息 */
export function getCommentsCalendar() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return nodepress
    .get<StatisticsCalendarItem[]>('/comments/calendar', { params: { timezone } })
    .then((response) => response.result)
}

/** 更新数据库备份 */
export function updateDatabaseBackup() {
  return nodepress.post(DATA_BASE_BACKUP_API_PATH).then((response) => response.result)
}

/** 获取系统配置 */
export function getOptions() {
  return nodepress.get<Options>(OPTIONS_API_PATH).then((response) => response.result)
}

/** 更新系统配置 */
export function updateOptions(options: Options) {
  return nodepress.patch<Options>(OPTIONS_API_PATH, options).then((response) => response.result)
}
