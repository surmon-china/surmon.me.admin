import React, { useEffect } from 'react'
import { Form, Select, Modal, Space, Divider, Typography, ModalProps } from 'antd'
import { UniversalEditor } from '@/components/common/UniversalEditor'
import { stringToYMD } from '@/transforms/date'
import { Announcement, AnnouncementStatus, announcementStatuses } from '@/constants/announcement'

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 19 }
}

export interface FormModalProps {
  width?: ModalProps['width']
  title: string
  open: boolean
  submitting: boolean
  initialData: Announcement | null
  onSubmit(data: Announcement): void
  onCancel(): void
}

export const FormModal: React.FC<FormModalProps> = (props) => {
  const [form] = Form.useForm<Announcement>()

  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(props.initialData ?? {})
  }, [props.initialData, props.open])

  return (
    <Modal
      width={props.width}
      centered={true}
      forceRender={true}
      destroyOnHidden={true}
      title={props.title}
      open={props.open}
      confirmLoading={props.submitting}
      onCancel={props.onCancel}
      onOk={handleSubmit}
      okText="提交"
    >
      <Form {...formLayout} colon={false} form={form}>
        {props.initialData && (
          <>
            <Form.Item label="ID">
              <Space size="small">
                <Typography.Text>{props.initialData.id}</Typography.Text>
                <Divider orientation="vertical" />
                <Typography.Text type="secondary">{props.initialData._id}</Typography.Text>
              </Space>
            </Form.Item>
            <Form.Item label="发布于">{stringToYMD(props.initialData.created_at)}</Form.Item>
            <Form.Item label="最后修改于">{stringToYMD(props.initialData.updated_at)}</Form.Item>
          </>
        )}
        <Form.Item
          label="发布状态"
          name="status"
          initialValue={AnnouncementStatus.Published}
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select
            placeholder="选择状态"
            options={announcementStatuses.map((status) => ({
              value: status.id,
              label: (
                <Space size="small">
                  {status.icon}
                  {status.name}
                </Space>
              )
            }))}
          />
        </Form.Item>
        <Form.Item
          label="公告内容"
          name="content"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <UniversalEditor
            placeholder="输入公告内容..."
            rows={10}
            autoFocus={true}
            disabledToolbar={true}
            disabledFoldGutter={true}
            disabledLineNumbers={true}
            disabledCacheDraft={true}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
