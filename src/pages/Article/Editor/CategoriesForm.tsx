import React from 'react'
import { Form } from 'antd'
import type { FormInstance } from 'antd'
import type { CategoriesFormModel } from '.'
import { CategoryTreeSelect } from './components/CategoryTreeSelect'

export interface CategoriesFormProps {
  form: FormInstance<CategoriesFormModel>
}

export const CategoriesForm: React.FC<CategoriesFormProps> = (props) => {
  return (
    <Form scrollToFirstError={true} form={props.form}>
      <Form.Item
        noStyle={true}
        required={true}
        name="categories"
        rules={[
          {
            message: '至少应该选择一个分类',
            validator(_, value: string[]) {
              if (value?.length) {
                return Promise.resolve()
              } else {
                return Promise.reject()
              }
            }
          }
        ]}
      >
        <CategoryTreeSelect />
      </Form.Item>
    </Form>
  )
}
