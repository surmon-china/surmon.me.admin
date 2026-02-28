import React from 'react'
import { onMounted } from 'veact'
import { Form, Typography, Input, Button, Divider, InputNumber, Select, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { Comment, commentStatuses, getCommentTargetType } from '@/constants/comment'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { UniversalEditor } from '@/components/common/UniversalEditor'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { UserAgent } from '@/components/common/UserAgent'
import { stringToYMD } from '@/transforms/date'
import { CommentAvatar } from './Avatar'

export interface EditFormProps {
  submitting: boolean
  comment: Comment
  onSubmit(comment: Comment): void
}

export const EditForm: React.FC<EditFormProps> = (props) => {
  const [form] = Form.useForm<Comment>()

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  onMounted(() => {
    form.setFieldsValue(props.comment)
  })

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      scrollToFirstError={true}
      colon={false}
      form={form}
    >
      <Form.Item label="ID">
        <Space size="small">
          <Typography.Text>{props.comment?.id}</Typography.Text>
          <Divider orientation="vertical" />
          <Typography.Text type="secondary">{props.comment._id}</Typography.Text>
        </Space>
      </Form.Item>
      <Form.Item label="发布于">{stringToYMD(props.comment.created_at)}</Form.Item>
      <Form.Item label="宿主页面">
        {getCommentTargetType(props.comment?.target_type).name}{' '}
        <span>#{props.comment?.target_id}</span>
      </Form.Item>
      <Form.Item label="父级评论">
        <UniversalText
          text={props.comment?.parent_id ? `#${props.comment.parent_id}` : null}
          placeholder="无"
        />
      </Form.Item>
      <Form.Item label="作者头像">
        <CommentAvatar size={56} shape="square" comment={props.comment!} />
      </Form.Item>
      <Form.Item
        name="author_name"
        label="作者名称"
        rules={[{ required: true, message: '必填' }]}
      >
        <Input prefix={<Icons.UserOutlined />} />
      </Form.Item>
      <Form.Item
        name="author_email"
        label="作者邮箱"
        rules={[
          {
            message: '请输入正确的邮箱',
            type: 'email'
          }
        ]}
      >
        <Input prefix={<Icons.MailOutlined />} placeholder="email" type="email" />
      </Form.Item>
      <Form.Item
        name="author_website"
        label="作者网址"
        rules={[
          {
            message: '请输入正确的 URL',
            type: 'url'
          }
        ]}
      >
        <Input
          prefix={<Icons.LinkOutlined />}
          type="url"
          placeholder="URL"
          suffix={
            <Icons.SendOutlined
              onClick={() => {
                const url = props.comment?.author_website
                if (url) {
                  window.open(url)
                }
              }}
            />
          }
        />
      </Form.Item>
      <Form.Item label="IP 地址">
        <UniversalText text={props.comment?.ip} copyable={true} placeholder="无" />
      </Form.Item>
      <Form.Item label="IP 地理位置">
        <IPLocation ipLocation={props.comment?.ip_location} emoji={true} detailed={true} />
      </Form.Item>
      <Form.Item label="设备">
        <UserAgent
          userAgent={props.comment.user_agent}
          orientation="horizontal"
          size="small"
          separator={<Divider orientation="vertical" />}
        />
      </Form.Item>
      <Form.Item name="likes" label="被赞" rules={[{ required: true, message: '必填' }]}>
        <InputNumber suffix={<Icons.LikeOutlined />} min={0} placeholder="多少" />
      </Form.Item>
      <Form.Item name="dislikes" label="被踩" rules={[{ required: true, message: '必填' }]}>
        <InputNumber suffix={<Icons.DislikeOutlined />} min={0} placeholder="多少" />
      </Form.Item>
      <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
        <Select
          placeholder="选择状态"
          options={commentStatuses.map((status) => {
            return {
              value: status.id,
              label: (
                <Space size="small">
                  {status.icon}
                  {status.name}
                </Space>
              )
            }
          })}
        />
      </Form.Item>
      <Form.Item
        label="评论内容"
        name="content"
        rules={[{ required: true, message: '请输入内容' }]}
      >
        <UniversalEditor
          rows={12}
          placeholder="输入评论内容..."
          disabledLanguageSelect={true}
          disabledLineNumbers={true}
          disabledFoldGutter={true}
          disabledCacheDraft={true}
        />
      </Form.Item>
      <Form.Item label="自定义扩展" extra="可以为当前评论增加自定义扩展属性" shouldUpdate={true}>
        <FormKeyValueInput formFieldName="extras" />
      </Form.Item>
      <Form.Item label="最后修改于">{stringToYMD(props.comment?.updated_at!)}</Form.Item>
      <Form.Item label=" ">
        <Button
          type="primary"
          icon={<Icons.CheckOutlined />}
          loading={props.submitting}
          onClick={handleSubmit}
        >
          提交更新
        </Button>
      </Form.Item>
    </Form>
  )
}
