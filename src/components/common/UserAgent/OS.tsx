import React from 'react'
import * as Icons from '@ant-design/icons'
import { UAParser } from 'ua-parser-js'
import { UniversalText } from '../UniversalText'
import { UserAgentProps, DFAULT_SEPARATOR, getOsIcon } from './helper'

export const AgentOS: React.FC<UserAgentProps> = (props) => {
  let text = null as string | null
  let icon = (<Icons.DesktopOutlined />) as React.ReactNode

  if (props.userAgent) {
    const { os } = UAParser(props.userAgent)
    const texts = [os.name, os.version].filter(Boolean)
    text = texts.length ? texts.join(DFAULT_SEPARATOR) : null
    icon = getOsIcon(os.name)
  }

  return <UniversalText prefix={icon} text={text} placeholder="未知系统" />
}
