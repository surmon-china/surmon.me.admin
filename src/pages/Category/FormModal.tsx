import React, { useEffect } from 'react'
import type { TreeDataNode, ModalProps } from 'antd'
import { Form, Input, Modal, TreeSelect, Typography, Divider, Space } from 'antd'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { Category as CategoryType } from '@/constants/category'
import { stringToYMD } from '@/transforms/date'

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}

const CATEGORY_NULL_VALUE = 'null'
const DEFAULT_CATEGORY_DATA: Partial<CategoryType> = {
  pid: CATEGORY_NULL_VALUE,
  extras: [
    {
      key: 'icon-name',
      value: 'icon-category'
    }
  ]
}

export interface FormModalProps {
  width?: ModalProps['width']
  title: string
  open: boolean
  submitting: boolean
  initData: CategoryType | null
  selectTree: TreeDataNode[]
  onSubmit(data: CategoryType): void
  onCancel(): void
}

export const FormModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm<CategoryType>()

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit({
        ...formValue,
        pid: formValue.pid === CATEGORY_NULL_VALUE ? null : formValue.pid
      })
    })
  }

  useEffect(() => {
    if (props.initData) {
      form.resetFields()
      form.setFieldsValue({
        ...props.initData,
        pid: props.initData.pid ?? CATEGORY_NULL_VALUE
      })
    } else {
      form.resetFields()
      form.setFieldsValue({ ...DEFAULT_CATEGORY_DATA })
    }
  }, [props.initData, props.open])

  return (
    <Modal
      width={props.width}
      centered={true}
      forceRender={true}
      title={props.title}
      confirmLoading={props.submitting}
      open={props.open}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okText="提交"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.initData && (
          <>
            <Form.Item label="ID">
              <Space size="small">
                <Typography.Text copyable={true}>{props.initData.id}</Typography.Text>
                <Divider orientation="vertical" />
                <Typography.Text copyable={true}>{props.initData._id}</Typography.Text>
              </Space>
            </Form.Item>
            <Form.Item label="创建于">{stringToYMD(props.initData.created_at)}</Form.Item>
            <Form.Item label="最后修改于">{stringToYMD(props.initData.updated_at)}</Form.Item>
          </>
        )}
        <Form.Item
          name="name"
          label="分类名称"
          extra="这将是它在站点上显示的名字"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input placeholder="分类名称" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="分类别名"
          extra="“别名” 是在 URL 中使用的别称，仅支持小写字母、数字、连字符（-）"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input placeholder="分类别名" />
        </Form.Item>
        <Form.Item
          name="pid"
          label="父分类"
          extra="可以选择父级分类"
          rules={[
            {
              message: '请选择正确的父分类',
              validator(_, value) {
                if (value === CATEGORY_NULL_VALUE) {
                  return Promise.resolve()
                } else if (value === props.initData?._id) {
                  return Promise.reject()
                } else {
                  return Promise.resolve()
                }
              }
            }
          ]}
        >
          <TreeSelect
            placeholder="选择父分类"
            treeDefaultExpandAll={true}
            treeData={[
              {
                label: '无',
                key: 'null',
                value: CATEGORY_NULL_VALUE
              },
              ...props.selectTree
            ]}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="分类描述"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea rows={4} placeholder="分类描述" />
        </Form.Item>
        <Form.Item
          label="自定义扩展"
          extra="可以为当前分类增加自定义扩展属性，如：icon-name、background-color"
          shouldUpdate={true}
        >
          <FormKeyValueInput formFieldName="extras" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
