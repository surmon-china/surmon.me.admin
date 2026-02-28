import React from 'react'
import * as Icons from '@ant-design/icons'

export const DFAULT_SEPARATOR = ' · '

export interface UserAgentProps {
  userAgent: string | null
}

export const getOsIcon = (osName?: string): React.ReactNode => {
  if (!osName) return <Icons.DesktopOutlined />
  const map: Record<string, React.ReactNode> = {
    'Chrome OS': <Icons.ChromeOutlined />,
    macOS: <Icons.AppleOutlined />,
    iOS: <Icons.AppleOutlined />,
    Windows: <Icons.WindowsOutlined />,
    Android: <Icons.AndroidOutlined />,
    Ubuntu: <Icons.LinuxOutlined />,
    Linux: <Icons.LinuxOutlined />
  }
  return map[osName] || <Icons.DesktopOutlined />
}

export const getBrowserIcon = (browserName?: string): React.ReactNode => {
  if (!browserName) return <Icons.GlobalOutlined />
  const map: Record<string, React.ReactNode> = {
    Chrome: <Icons.ChromeOutlined />,
    'Mobile Chrome': <Icons.ChromeOutlined />,
    Chromium: <Icons.ChromeOutlined />,
    Safari: <Icons.CompassOutlined />,
    'Mobile Safari': <Icons.CompassOutlined />,
    Firefox: <Icons.FireOutlined />,
    'Mobile Firefox': <Icons.FireOutlined />,
    IE: <Icons.IeOutlined />,
    Edge: <Icons.IeOutlined />,
    WeChat: <Icons.WechatOutlined />,
    Twitter: <Icons.TwitterOutlined />,
    Instagram: <Icons.InstagramOutlined />,
    QQ: <Icons.QqOutlined />
  }
  return map[browserName] || <Icons.GlobalOutlined />
}

export const getDeviceIcon = (deviceType?: string): React.ReactNode => {
  const map: Record<string, React.ReactNode> = {
    mobile: <Icons.MobileOutlined />,
    tablet: <Icons.TabletOutlined />,
    smarttv: <Icons.DesktopOutlined />,
    wearable: <Icons.DashboardOutlined />
  }
  return deviceType ? map[deviceType] || <Icons.LaptopOutlined /> : <Icons.LaptopOutlined />
}
