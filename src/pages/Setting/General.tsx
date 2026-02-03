import React from 'react'
import { useRef, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Form, Input, Button, Select, Spin } from 'antd'
import * as Icons from '@ant-design/icons'
import * as api from '@/apis/system'
import { UniversalEditor, UnEditorLanguage } from '@/components/common/UniversalEditor'
import { FormKeyValueInput } from '@/components/common/FormKeyValueInput'
import { Options } from '@/constants/options'
import { scrollTo } from '@/utils/scroller'
import { formatJSONString } from '@/transforms/json'

export interface GeneralFormProps {
  labelSpan: number
  wrapperSpan: number
}

export const GeneralForm: React.FC<GeneralFormProps> = (props) => {
  const fetching = useLoading()
  const updating = useLoading()
  const data = useRef<Options | null>(null)
  const [form] = Form.useForm<Options>()

  const resetForm = (options: Options) => {
    data.value = options
    form.setFieldsValue({
      ...options,
      app_config: formatJSONString(options.app_config, 2)
    })
  }

  const fetchOptions = () => {
    return fetching.promise(api.getOptions()).then(resetForm)
  }

  const updateOptions = (newOptions: Options) => {
    const payload = {
      ...newOptions,
      app_config: formatJSONString(newOptions.app_config)
    }
    return updating.promise(api.putOptions(payload)).then(resetForm)
  }

  const handleSubmit = () => {
    form.validateFields().then((formValues) => {
      const payload = {
        ...data.value,
        ...formValues
      }
      updateOptions(payload).then(() => {
        scrollTo(document.body)
      })
    })
  }

  onMounted(() => {
    fetchOptions()
  })

  return (
    <Spin spinning={fetching.state.value || updating.state.value}>
      <Form
        form={form}
        colon={false}
        scrollToFirstError={true}
        labelCol={{ span: props.labelSpan }}
        wrapperCol={{ span: props.wrapperSpan }}
      >
        <Form.Item name="title" label="站点标题" required={true}>
          <Input placeholder="站点标题" />
        </Form.Item>
        <Form.Item name="sub_title" label="副标题" required={true}>
          <Input placeholder="副标题" />
        </Form.Item>
        <Form.Item name="description" label="站点描述" required={true}>
          <Input.TextArea rows={4} placeholder="站点描述" />
        </Form.Item>
        <Form.Item name="keywords" label="SEO 关键词" required={true}>
          <Select placeholder="输入关键词后回车" mode="tags" />
        </Form.Item>
        <Form.Item
          name="site_url"
          label="站点地址"
          required={true}
          rules={[
            {
              message: '请输入',
              required: true
            },
            {
              message: '请输入正确的 URL',
              type: 'url'
            }
          ]}
        >
          <Input suffix={<Icons.LinkOutlined />} placeholder="https://example.me" />
        </Form.Item>
        <Form.Item
          name="site_email"
          label="电子邮件"
          required={true}
          rules={[
            {
              message: '请输入',
              required: true
            },
            {
              message: '请输入正确的邮箱地址',
              type: 'email'
            }
          ]}
        >
          <Input suffix={<Icons.MailOutlined />} placeholder="example@xxx.me" />
        </Form.Item>
        <Form.Item name="statement" label="站点声明">
          <UniversalEditor
            rows={26}
            eid="app-setting-statement"
            placeholder="输入 Markdown 内容作为站点声明"
            defaultLanguage={UnEditorLanguage.Markdown}
            disabledLanguageSelect={true}
            disabledCacheDraft={true}
            disabledLineNumbers={true}
          />
        </Form.Item>
        <Form.Item label="友情链接" extra="name 为名称，url 为链接地址" shouldUpdate={true}>
          <FormKeyValueInput formFieldName="friend_links" keyField="name" valueField="url" />
        </Form.Item>
        <Form.Item
          name={['blocklist', 'ips']}
          label="Blocklist IP"
          extra="这些 IP 来源的评论将被拒绝"
        >
          <Select placeholder="回车以输入多个 IP 地址" mode="tags" />
        </Form.Item>
        <Form.Item
          name={['blocklist', 'mails']}
          label="Blocklist 邮箱"
          extra="这些邮箱来源的评论将被拒绝"
        >
          <Select placeholder="回车以输入多个邮箱" mode="tags" />
        </Form.Item>
        <Form.Item
          name={['blocklist', 'keywords']}
          label="Blocklist 关键字"
          extra="包含这些关键字的的评论将被拒绝"
        >
          <Select placeholder="回车以输入多个关键字" mode="tags" />
        </Form.Item>
        <Form.Item
          name="app_config"
          label="App Config"
          extra="通用站点配置，用于给下游的不同客户端消费"
          rules={[
            {
              message: '请输入合法的 JSON 数据',
              validator(_, value) {
                try {
                  formatJSONString(value || '')
                  return Promise.resolve()
                } catch (error) {
                  return Promise.reject(error)
                }
              }
            }
          ]}
        >
          <UniversalEditor
            rows={24}
            eid="app-setting-json-config"
            placeholder="{ some_config: ... }"
            defaultLanguage={UnEditorLanguage.JSON}
            disabledCacheDraft={true}
            disabledLineNumbers={true}
          />
        </Form.Item>
        <Form.Item label>
          <Button
            icon={<Icons.CheckOutlined />}
            type="primary"
            size="large"
            style={{ width: 120 }}
            loading={updating.state.value}
            onClick={handleSubmit}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  )
}
