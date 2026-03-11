/**
 * @file Date
 * @author Surmon <https://github.com/surmon-china>
 */

import dayjs from 'dayjs'

/** Dayjs → Unix timestamp */
export const dayjsToTimestamp = (dayjs: dayjs.Dayjs) => dayjs.unix()

/** Unix timestamp → Dayjs */
export const timestampToDayjs = (timestamp: number) => dayjs.unix(timestamp)

/** Timestamp → YMD */
export const timestampToYMD = (timestamp: number) => {
  return dayjs(timestamp)?.format('YYYY-MM-DD HH:mm:ss')
}

/** String date → YMD */
export const stringToYMD = (string: string) => {
  return dayjs(string)?.format('YYYY-MM-DD HH:mm:ss')
}

export const timeFromNow = (time: string | number) => {
  return dayjs(time)?.fromNow()
}
