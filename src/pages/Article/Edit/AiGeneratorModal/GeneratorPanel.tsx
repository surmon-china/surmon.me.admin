import React from 'react'
import { Form, Select, Input, Slider, Button, Space, Typography } from 'antd'
import { UniversalText } from '@/components/common/UniversalText'
import * as Icons from '@ant-design/icons'
import { AiConfig } from '@/apis/ai'

export interface GeneratorForm {
  model: string
  temperature: number
  prompt: string
}

export interface AiGeneratorPanelProps {
  articleId: number
  aiConfig: AiConfig | null
  generating: boolean
  generatorType: keyof AiConfig['prompts']
  onGenerate(formValues: GeneratorForm): void
}

export const AiGeneratorPanel: React.FC<AiGeneratorPanelProps> = (props) => {
  const [form] = Form.useForm<GeneratorForm>()
  const customPrompt = Form.useWatch('prompt', form)

  const handleGenerate = async () => {
    props.onGenerate(await form.validateFields())
  }

  return (
    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
      <Form form={form} layout="vertical">
        <Form.Item name="model" label="选择模型 (可选)">
          <Select
            allowClear
            placeholder="采用系统默认最优模型"
            options={props.aiConfig?.models?.map((m: any) => ({
              value: m.id,
              label: (
                <Space size="small">
                  <Typography.Text>{m.provider}</Typography.Text>
                  <Typography.Text type="secondary">{m.model}</Typography.Text>
                </Space>
              )
            }))}
          />
        </Form.Item>
        <Form.Item name="temperature" label="创造力 (Temperature)">
          <Slider min={0} max={2} step={0.1} marks={{ 0: '严谨', 2: '发散' }} />
        </Form.Item>
        <Form.Item name="prompt" label="自定义提示词">
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="输入自定义指令，留空则采用系统默认提示词"
          />
        </Form.Item>
      </Form>
      <Space orientation="vertical" size="small">
        <UniversalText prefix={<Icons.InfoCircleOutlined />} text="当前将采用的提示词：" />
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: '展开' }}
          style={{ maxHeight: '11em', overflowY: 'auto' }}
        >
          {customPrompt?.trim() || props.aiConfig?.prompts?.[props.generatorType] || '-'}
        </Typography.Paragraph>
      </Space>
      <Button
        type="primary"
        block={true}
        icon={<Icons.RobotOutlined />}
        loading={props.generating}
        onClick={handleGenerate}
      >
        {props.generating ? '生成中...' : '开始生成'}
      </Button>
    </Space>
  )
}
