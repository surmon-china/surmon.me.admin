import React, { useEffect } from 'react'
import { Form, Typography, Input, Button, Divider, Select } from 'antd'
import { Space, Switch, Collapse, Descriptions, Avatar } from 'antd'
import * as Icons from '@ant-design/icons'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { UniversalText } from '@/components/common/UniversalText'
import { UserType, userTypes, getUserIdentityList } from '@/constants/user'
import { User, UserIdentityProvider } from '@/constants/user'
import { stringToYMD } from '@/transforms/date'

export interface EditFormProps {
  initialData: User | null
  submitting: boolean
  identityProcessing: boolean
  onSubmit(user: User): void
  onUnlinkIdentity(user: User, provider: UserIdentityProvider): void
}

export const EditForm: React.FC<EditFormProps> = (props) => {
  const [form] = Form.useForm<User>()

  const handleSubmit = () => {
    form.validateFields().then(props.onSubmit)
  }

  useEffect(() => {
    form.resetFields()
    form.setFieldsValue(props.initialData ?? {})
  }, [props.initialData])

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      scrollToFirstError={true}
      colon={false}
      form={form}
    >
      {props.initialData && (
        <>
          <Form.Item label="ID">
            <Space size="small">
              <Typography.Text>{props.initialData.id}</Typography.Text>
              <Divider orientation="vertical" />
              <Typography.Text type="secondary">{props.initialData._id}</Typography.Text>
            </Space>
          </Form.Item>
          <Form.Item label="最早创建于">{stringToYMD(props.initialData.created_at!)}</Form.Item>
          <Form.Item label="最后修改于">{stringToYMD(props.initialData.updated_at!)}</Form.Item>
          <Form.Item label="头像">
            <Avatar src={props.initialData.avatar_url} size={58} shape="square" />
          </Form.Item>
        </>
      )}
      <Form.Item
        name="type"
        label="用户类型"
        rules={[{ required: true, message: '请选择类型' }]}
        initialValue={UserType.Standard}
      >
        <Select
          placeholder="选择类型"
          options={userTypes.map((type) => {
            return {
              value: type.id,
              label: (
                <Space size="small">
                  {type.icon}
                  {type.name}
                </Space>
              )
            }
          })}
        />
      </Form.Item>
      <Form.Item name="disabled" label="是否禁用" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否" style={{ width: 50 }} />
      </Form.Item>
      <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
        <Input prefix={<Icons.UserOutlined />} placeholder="name" />
      </Form.Item>
      <Form.Item name="email" label="邮箱">
        <Input prefix={<Icons.MailOutlined />} placeholder="email" type="email" />
      </Form.Item>
      <Form.Item name="website" label="网址">
        <Input prefix={<Icons.LinkOutlined />} placeholder="website" type="url" />
      </Form.Item>
      <Form.Item name="avatar_url" label="头像地址">
        <Input prefix={<Icons.LinkOutlined />} placeholder="avatar url" type="url" />
      </Form.Item>
      {props.initialData && (
        <Form.Item label="身份绑定">
          <Collapse
            size="small"
            items={getUserIdentityList(props.initialData.identities).map((item) => ({
              key: item.provider,
              collapsible: item.linked ? 'header' : 'disabled',
              label: (
                <UniversalText
                  key={item.provider}
                  prefix={item.icon}
                  text={item.displayId}
                  placeholder="未绑定"
                />
              ),
              extra: item.linked && (
                <Button
                  size="small"
                  type="link"
                  danger={true}
                  icon={<Icons.DeleteOutlined />}
                  loading={props.identityProcessing}
                  onClick={() => props.onUnlinkIdentity(props.initialData!, item.provider)}
                >
                  删除绑定
                </Button>
              ),
              children: item.originalData && (
                <Descriptions
                  column={1}
                  items={Object.keys(item.originalData).map((key) => ({
                    key,
                    label: key,
                    children: String((item.originalData as any)[key])
                  }))}
                />
              )
            }))}
          />
        </Form.Item>
      )}
      <Form.Item label="自定义扩展" extra="可以为当前评论增加自定义扩展属性" shouldUpdate={true}>
        <FormKeyValueInput formFieldName="extras" />
      </Form.Item>
      <Form.Item label=" ">
        <Button
          type="primary"
          icon={<Icons.CheckOutlined />}
          loading={props.submitting}
          onClick={handleSubmit}
        >
          提交
        </Button>
      </Form.Item>
    </Form>
  )
}
