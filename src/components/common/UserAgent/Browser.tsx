import React from 'react'
import * as Icons from '@ant-design/icons'
import { UAParser } from 'ua-parser-js'
import { UniversalText } from '../UniversalText'
import { UserAgentProps, DFAULT_SEPARATOR, getBrowserIcon } from './helper'

export const AgentBrowser: React.FC<UserAgentProps> = (props) => {
  let text = null as string | null
  let icon = (<Icons.GlobalOutlined />) as React.ReactNode

  if (props.userAgent) {
    const { browser } = UAParser(props.userAgent)
    const texts = [browser.name, browser.version].filter(Boolean)
    text = texts.length ? texts.join(DFAULT_SEPARATOR) : null
    icon = getBrowserIcon(browser.name)
  }

  return <UniversalText prefix={icon} text={text} placeholder="未知浏览器" />
}
