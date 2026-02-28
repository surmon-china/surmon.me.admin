import React from 'react'
import { Card, Typography, Button, Space, Divider } from 'antd'
import * as Icons from '@ant-design/icons'
import { UniversalText } from '@/components/common/UniversalText'
import { timestampToYMD } from '@/transforms/date'
import { AiHistoryRecord } from './history'

export interface AiResultPanelProps {
  record: AiHistoryRecord | null
  generating: boolean
  onApply(): void
  extra?: React.ReactNode
}

export const AiResultPanel: React.FC<AiResultPanelProps> = (props) => {
  const { record, extra, generating, onApply } = props

  return (
    <Card
      size="small"
      title={generating ? '生成中...' : '生成结果'}
      loading={generating}
      extra={extra}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
      styles={{
        body: {
          flex: 1,
          maxHeight: '39rem',
          overflowY: 'scroll'
        }
      }}
    >
      {record ? (
        <div>
          <Space separator={<Divider orientation="vertical" size="small" />}>
            <UniversalText
              prefix={<Icons.BlockOutlined />}
              text={`${record.provider} / ${record.model}`}
            />
            <UniversalText
              prefix={<Icons.ClockCircleOutlined />}
              text={timestampToYMD(record.created_at)}
            />
          </Space>
          <Divider size="small" />
          <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
            {record.content}
          </Typography.Paragraph>
          <Button
            key="apply"
            type="primary"
            shape="square"
            style={{ position: 'absolute', right: '2rem', bottom: '1rem' }}
            disabled={!record}
            onClick={() => onApply()}
          >
            采纳当前内容
          </Button>
        </div>
      ) : (
        <Space
          orientation="vertical"
          style={{ width: '100%', textAlign: 'center', marginTop: 80 }}
        >
          <Typography.Text type="secondary">
            <Icons.CoffeeOutlined style={{ fontSize: 48 }} />
          </Typography.Text>
          <Typography.Text type="secondary">点击左侧按钮开始生成</Typography.Text>
        </Space>
      )}
    </Card>
  )
}
