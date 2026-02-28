import React from 'react'
import { onMounted } from 'veact'
import { Form, Typography, Card, Input, Button, Divider, Radio, Space, Statistic } from 'antd'
import * as Icons from '@ant-design/icons'
import { AuthorAvatar, AuthorName, AuthorEmail } from '@/components/common/AuthorProfile'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { UserAgent } from '@/components/common/UserAgent'
import { Feedback, getMarkedByBoolean } from '@/constants/feedback'
import { stringToYMD } from '@/transforms/date'

export interface EditFormProps {
  submitting: boolean
  feedback: Feedback
  onSubmit(feedback: Feedback): void
}

export const EditForm: React.FC<EditFormProps> = (props) => {
  const [form] = Form.useForm<Feedback>()

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  onMounted(() => {
    form.setFieldsValue(props.feedback)
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
          <Typography.Text>{props.feedback.id}</Typography.Text>
          <Divider orientation="vertical" />
          <Typography.Text type="secondary">{props.feedback._id}</Typography.Text>
        </Space>
      </Form.Item>
      <Form.Item label="创建于">{stringToYMD(props.feedback.created_at)}</Form.Item>
      <Form.Item label="最后修改于">{stringToYMD(props.feedback.updated_at)}</Form.Item>
      <Form.Item label="IP 地址">
        <UniversalText text={props.feedback.ip || null} copyable={true} />
      </Form.Item>
      <Form.Item label="IP 地理位置">
        <IPLocation ipLocation={props.feedback.ip_location} detailed={true} emoji={true} />
      </Form.Item>
      <Form.Item label="请求来源">
        <Typography.Link href={props.feedback.origin!} target="_blank">
          {props.feedback.origin}
        </Typography.Link>
      </Form.Item>
      <Form.Item label="设备">
        <UserAgent
          userAgent={props.feedback.user_agent}
          size="small"
          separator={<Divider orientation="vertical" />}
        />
      </Form.Item>
      <Form.Item label="作者">
        <Space orientation="horizontal" size="large">
          <AuthorAvatar
            user={props.feedback.user}
            author_type={props.feedback.author_type}
            author_name={props.feedback.author_name}
            author_email={props.feedback.author_email}
            tooltip={true}
            badge={true}
          />
          <Space orientation="vertical">
            <AuthorName
              user={props.feedback.user}
              author_type={props.feedback.author_type}
              author_name={props.feedback.author_name}
              tooltip={true}
            />
            <AuthorEmail
              user={props.feedback.user}
              author_type={props.feedback.author_type}
              author_email={props.feedback.author_email}
              copyable={true}
            />
          </Space>
        </Space>
      </Form.Item>
      <Form.Item label="反馈评分">
        <Statistic
          prefix={props.feedback.emotion_emoji}
          value={`${props.feedback.emotion_text} (${props.feedback.emotion})`}
        />
      </Form.Item>
      <Form.Item label="反馈内容">
        <Card size="small">
          <Typography.Paragraph>{props.feedback.content}</Typography.Paragraph>
        </Card>
      </Form.Item>
      <Divider variant="dashed" />
      <Form.Item name="marked" label="是否标记">
        <Radio.Group size="middle">
          <Radio.Button value={false}>{getMarkedByBoolean(false).icon}</Radio.Button>
          <Radio.Button value={true}>{getMarkedByBoolean(true).icon}</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 8 }}
          placeholder="管理员可以给自己留下备注"
        />
      </Form.Item>
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
