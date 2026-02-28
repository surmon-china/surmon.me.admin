import React from 'react'
import { Space } from 'antd'
import type { SizeType } from 'antd/lib/config-provider/SizeContext'
import type { Orientation } from 'antd/lib/_util/hooks'
import { UserAgentProps } from './helper'
import { AgentOverview } from './OverView'
import { AgentBrowser } from './Browser'
import { AgentDevice } from './Device'
import { AgentOS } from './OS'

export interface UserAgentCompProps extends UserAgentProps {
  size?: SizeType
  orientation?: Orientation
  separator?: React.ReactNode
}

export const UserAgent: React.FC<UserAgentCompProps> & {
  OverView: typeof AgentOverview
  Browser: typeof AgentBrowser
  Device: typeof AgentDevice
  OS: typeof AgentOS
} = (props: UserAgentCompProps) => {
  return (
    <Space size={props.size} orientation={props.orientation} separator={props.separator}>
      <AgentBrowser {...props} />
      <AgentOS {...props} />
      <AgentDevice {...props} />
    </Space>
  )
}

UserAgent.OverView = AgentOverview
UserAgent.Browser = AgentBrowser
UserAgent.Device = AgentDevice
UserAgent.OS = AgentOS
