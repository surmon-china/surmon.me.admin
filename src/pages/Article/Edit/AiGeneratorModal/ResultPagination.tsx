import React from 'react'
import { Button, Space, Typography, Divider } from 'antd'
import * as Icons from '@ant-design/icons'

export interface AiResultPaginationProps {
  total: number
  currentIndex: number
  onChangeIndex(index: number): void
  onClear(): void
}

export const AiResultPagination: React.FC<AiResultPaginationProps> = (props) => {
  const { total, currentIndex, onChangeIndex, onClear } = props

  if (total === 0) return null

  return (
    <Space size="small">
      <Button
        color="default"
        variant="link"
        size="small"
        icon={<Icons.LeftOutlined />}
        disabled={currentIndex === 0}
        onClick={() => onChangeIndex(currentIndex - 1)}
      />
      <Typography.Text type="secondary">
        {currentIndex + 1} / {total}
      </Typography.Text>
      <Button
        color="default"
        variant="link"
        size="small"
        icon={<Icons.RightOutlined />}
        disabled={currentIndex === total - 1}
        onClick={() => onChangeIndex(currentIndex + 1)}
      />
      <Divider orientation="vertical" />
      <Button type="link" danger={true} size="small" onClick={onClear}>
        清空历史
      </Button>
    </Space>
  )
}
