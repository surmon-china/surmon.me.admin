import React from 'react'
import { onMounted, useShallowRef } from 'veact'
import { Form, Typography, Input, Button, Divider, InputNumber, Select, Space } from 'antd'
import * as Icons from '@ant-design/icons'
import { getArticle } from '@/apis/article'
import { Article } from '@/constants/article'
import { Comment, commentStatuses, COMMENT_GUESTBOOK_POST_ID } from '@/constants/comment'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { UniversalEditor } from '@/components/common/UniversalEditor'
import { UniversalText } from '@/components/common/UniversalText'
import { IPLocation } from '@/components/common/IPLocation'
import { parseBrowser, parseOS, parseDevice } from '@/transforms/ua'
import { getBlogURLByPostId } from '@/transforms/url'
import { stringToYMD } from '@/transforms/date'
import { CommentAvatar } from './Avatar'

export interface EditFormProps {
  submitting: boolean
  comment: Comment
  onSubmit(comment: Comment): void
}

export const EditForm: React.FC<EditFormProps> = (props) => {
  const [form] = Form.useForm<Comment>()
  const commentArticle = useShallowRef<Article | null>(null)
  const fetchArticle = (articleId: number) => {
    getArticle(articleId).then((result) => {
      commentArticle.value = result
    })
  }

  const handleSubmit = () => {
    form.validateFields().then((formValue) => {
      props.onSubmit(formValue)
    })
  }

  onMounted(() => {
    form.setFieldsValue(props.comment)
    if (props.comment.post_id !== COMMENT_GUESTBOOK_POST_ID) {
      fetchArticle(props.comment.post_id)
    }
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
          <Typography.Text copyable={true}>{props.comment?.id}</Typography.Text>
          <Divider orientation="vertical" />
          <Typography.Text copyable={true}>{props.comment?._id}</Typography.Text>
        </Space>
      </Form.Item>
      <Form.Item label="发布于">{stringToYMD(props.comment?.created_at!)}</Form.Item>
      <Form.Item label="最后修改于">{stringToYMD(props.comment?.updated_at!)}</Form.Item>
      <Form.Item label="用户头像">
        <CommentAvatar size="large" comment={props.comment!} />
      </Form.Item>
      <Form.Item
        name={['author', 'name']}
        label="用户昵称"
        rules={[{ required: true, message: '必填' }]}
      >
        <Input prefix={<Icons.UserOutlined />} />
      </Form.Item>
      <Form.Item
        name={['author', 'email']}
        label="用户邮箱"
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
        name={['author', 'site']}
        label="用户网址"
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
                const url = props.comment?.author.site
                if (url) {
                  window.open(url)
                }
              }}
            />
          }
        />
      </Form.Item>
      <Form.Item label="IP 地址">
        <UniversalText text={props.comment?.ip} copyable={true} />
      </Form.Item>
      <Form.Item label="IP 地理位置">
        <IPLocation data={props.comment?.ip_location} fullname={true} />
      </Form.Item>
      <Form.Item label="终端">
        <UniversalText text={parseBrowser(props.comment?.agent!)} placeholder="未知浏览器" />
        <Divider orientation="vertical" />
        <UniversalText text={parseOS(props.comment?.agent!)} placeholder="未知系统" />
        <Divider orientation="vertical" />
        <UniversalText text={parseDevice(props.comment?.agent!)} placeholder="未知设备" />
      </Form.Item>
      <Form.Item name="likes" label="被赞" rules={[{ required: true, message: '必填' }]}>
        <InputNumber suffix={<Icons.LikeOutlined />} min={0} placeholder="多少" />
      </Form.Item>
      <Form.Item name="dislikes" label="被踩" rules={[{ required: true, message: '必填' }]}>
        <InputNumber suffix={<Icons.DislikeOutlined />} min={0} placeholder="多少" />
      </Form.Item>
      <Form.Item label="宿主页面">
        <Button
          type="link"
          target="_blank"
          icon={<Icons.LinkOutlined />}
          href={getBlogURLByPostId(props.comment?.post_id!)}
        >
          {props.comment?.post_id === COMMENT_GUESTBOOK_POST_ID
            ? '留言板'
            : (commentArticle.value?.title ?? '加载中⋯')}
          <Divider orientation="vertical" />
          <span>#{props.comment?.id}</span>
        </Button>
      </Form.Item>
      {props.comment?.pid ? (
        <Form.Item label="父级评论">
          <Typography.Text strong>#{props.comment?.pid}</Typography.Text>
        </Form.Item>
      ) : null}
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
