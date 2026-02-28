import React from 'react'
import * as Icons from '@ant-design/icons'
import { UAParser } from 'ua-parser-js'
import { UniversalText } from '../UniversalText'
import { UserAgentProps, DFAULT_SEPARATOR, getBrowserIcon } from './helper'

export const AgentOverview: React.FC<UserAgentProps> = (props) => {
  let text = null as string | null
  let icon = (<Icons.DesktopOutlined />) as React.ReactNode

  if (props.userAgent) {
    const { browser, os, device } = UAParser(props.userAgent)
    const result = []
    if (browser.name) result.push(browser.name)
    if (os.name) result.push(os.name)
    if (device.vendor) result.push(device.vendor)
    text = result.length ? result.join(DFAULT_SEPARATOR) : null
    icon = getBrowserIcon(browser.name)
  }

  return <UniversalText prefix={icon} text={text} placeholder="未知设备" />
}
