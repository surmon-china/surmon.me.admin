/**
 * @desc IP location
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Space, Typography } from 'antd'
import * as Icons from '@ant-design/icons'
import { IPLocation as IPLocationType } from '@/constants/general'
import { countryCodeToEmoji } from '@/transforms/country'

import styles from './style.module.less'

export interface IPLocationProps {
  ipLocation?: IPLocationType | null
  icon?: boolean
  emoji?: boolean
  detailed?: boolean
  placeholder?: React.ReactNode
}

export const IPLocation: React.FC<IPLocationProps> = (props) => {
  let emoji = null as string | null
  let locationText = null as string | null

  if (props.ipLocation) {
    const location = props.ipLocation
    const texts = props.detailed
      ? [location.country, location.region, location.city]
      : [location.country_code || location.country, location.city]
    locationText = texts.filter(Boolean).join(' · ')
    emoji = location.country_code ? countryCodeToEmoji(location.country_code) : null
  }

  return (
    <Space size="small">
      {props.icon && <Icons.EnvironmentOutlined />}
      {props.emoji && emoji && <span className={styles.emoji}>{emoji}</span>}
      {locationText ? (
        <Typography.Text>{locationText}</Typography.Text>
      ) : (
        <Typography.Text type="secondary">{props.placeholder ?? '未知 IP'}</Typography.Text>
      )}
    </Space>
  )
}
