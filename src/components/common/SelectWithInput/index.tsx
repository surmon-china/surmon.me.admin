/**
 * @desc Select with input search
 * @author Surmon <https://github.com/surmon-china>
 */

import classnames from 'classnames'
import React, { useMemo } from 'react'
import { Input, Select, Space } from 'antd'
import type { SpaceCompactProps } from 'antd/es/space/Compact'
import type { SelectProps } from 'antd/es/select'
import type { SearchProps } from 'antd/es/input'

import styles from './style.module.less'

export interface SelectWithInputProps<SelectValue = any> {
  // container
  size?: SpaceCompactProps['size']
  className?: string
  rootClassName?: string
  style?: React.CSSProperties

  // state
  loading?: boolean
  disabled?: boolean

  // select
  selectClassName?: string
  selectStyle?: React.CSSProperties
  selectPlaceholder?: string
  selectValue?: SelectValue
  selectOptions?: SelectProps<SelectValue>['options']
  onSelectChange?: SelectProps<SelectValue>['onChange']
  selectLabelRender?: SelectProps<SelectValue>['labelRender']

  // input
  inputClassName?: string
  inputStyle?: React.CSSProperties
  inputWidth?: SearchProps['width']
  inputType?: 'string' | 'number'
  inputPlaceholder?: string
  inputValue?: string | number
  onInputChange?(value: string): void
  onInputSearch?(value: string): void
}

export function SelectWithInput<SV = any>(props: SelectWithInputProps<SV>) {
  const inputProps = useMemo(() => {
    if (props.inputType !== 'number') {
      return {}
    }

    return {
      type: 'number',
      min: 0,
      step: 1
    }
  }, [props.inputType])

  return (
    <Space.Compact
      className={classnames(props.className, props.rootClassName)}
      style={props.style}
      size={props.size}
    >
      <Select<SV>
        className={props.selectClassName}
        style={props.selectStyle}
        placeholder={props.selectPlaceholder}
        loading={props.loading}
        disabled={props.disabled}
        labelRender={props.selectLabelRender}
        value={props.selectValue}
        options={props.selectOptions}
        onChange={props.onSelectChange}
      />
      <Input.Search
        className={classnames(styles.input, props.inputClassName)}
        style={props.inputStyle}
        width={props.inputWidth}
        placeholder={props.inputPlaceholder}
        loading={props.loading}
        disabled={props.disabled}
        allowClear={true}
        {...inputProps}
        value={props.inputValue}
        onChange={(event) => props.onInputChange?.(event.target.value)}
        onSearch={(value, __, info) => {
          if (info?.source === 'input') {
            props.onInputSearch?.(value)
          }
        }}
      />
    </Space.Compact>
  )
}
