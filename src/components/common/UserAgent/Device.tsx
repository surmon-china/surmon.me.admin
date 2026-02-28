import React from 'react'
import * as Icons from '@ant-design/icons'
import { UAParser } from 'ua-parser-js'
import { UniversalText } from '../UniversalText'
import { UserAgentProps, DFAULT_SEPARATOR, getDeviceIcon } from './helper'

export const AgentDevice: React.FC<UserAgentProps> = (props) => {
  let text = null as string | null
  let icon = (<Icons.LaptopOutlined />) as React.ReactNode

  if (props.userAgent) {
    const { device } = UAParser(props.userAgent)
    const texts = [device.vendor, device.model].filter(Boolean)
    text = texts.length ? texts.join(DFAULT_SEPARATOR) : null
    icon = getDeviceIcon(device.type)
  }

  return <UniversalText prefix={icon} text={text} placeholder="未知设备" />
}
