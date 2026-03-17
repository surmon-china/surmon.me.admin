/**
 * @desc Universal text
 * @author Surmon <https://github.com/surmon-china>
 */

import _isNil from 'lodash/isNil'
import React from 'react'
import { Typography, Space } from 'antd'
import type { BaseType } from 'antd/es/typography/Base'

export interface UniversalTextProps {
  text: React.ReactNode
  type?: BaseType
  copyable?: boolean
  strong?: boolean
  small?: boolean
  delete?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  placeholder?: React.ReactNode
}

export const UniversalText: React.FC<UniversalTextProps> = (props) => {
  const renderMainContent = () => {
    if (_isNil(props.text) || props.text === '') {
      return <Typography.Text type="secondary">{props.placeholder ?? '-'}</Typography.Text>
    }

    return (
      <Typography.Text
        copyable={props.copyable}
        type={props.type}
        strong={props.strong}
        delete={props.delete}
      >
        {props.small ? <small>{props.text}</small> : props.text}
      </Typography.Text>
    )
  }

  return (
    <Space size="small">
      {props.prefix}
      {renderMainContent()}
      {props.suffix}
    </Space>
  )
}
