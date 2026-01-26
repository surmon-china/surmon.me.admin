/**
 * @desc General key value data form
 * @author Surmon <https://github.com/surmon-china>
 */

import React from 'react'
import { Button, Input, Form, Space } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Trans } from '@/i18n'

import styles from './style.module.less'

export interface FormKeyValueInputProps {
  formFieldName: string
  keyField?: string
  valueField?: string
}

export const FormKeyValueInput: React.FC<FormKeyValueInputProps> = (props) => {
  const keyField = props.keyField ?? 'key'
  const valueField = props.valueField ?? 'value'

  return (
    <Form.List name={props.formFieldName}>
      {(listData, { add, remove }) => (
        <Space orientation="vertical" size="middle" className={styles.inputWrapper}>
          {listData.map((item) => (
            <Space size="middle" key={item.name} className={styles.inputGroup}>
              <Form.Item noStyle={true} required={true} name={[item.name, keyField]}>
                <Input placeholder={keyField} />
              </Form.Item>
              <Form.Item noStyle={true} required={true} name={[item.name, valueField]}>
                <Input placeholder={valueField} />
              </Form.Item>
              <Button
                icon={<DeleteOutlined />}
                danger={true}
                type="dashed"
                onClick={() => remove(item.name)}
              />
            </Space>
          ))}
          <Button block type="dashed" icon={<PlusOutlined />} onClick={() => add()}>
            <span>
              <Trans i18nKey="component.form_key_value.add" />
            </span>
          </Button>
        </Space>
      )}
    </Form.List>
  )
}
