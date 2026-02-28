import React from 'react'
import { Button, Select, Space, Typography, Flex } from 'antd'
import * as Icons from '@ant-design/icons'
import { UnEditorLanguage, UnEditorLanguages } from './shared/language'
import { UniversalEditorProps } from './'

import styles from './style.module.less'

export interface EditorToolbarProps {
  title: string
  disbaled?: boolean
  language: UnEditorLanguage
  isPreviewing: boolean
  isFullscreen: boolean
  disabledLanguageSelect?: boolean
  onPressSaveContent(): void
  onLanguageChange(language: UnEditorLanguage): void
  onPreviewingChange(state: boolean): void
  onFullscreenChange(state: boolean): void
  renderToolbarExtra?: UniversalEditorProps['renderToolbarExtra']
}

export const EditorToolbar: React.FC<EditorToolbarProps> = (props) => {
  return (
    <Flex className={styles.editorToolbar} justify="space-between" align="center">
      <Space className={styles.left} wrap>
        <Typography.Text type="secondary" strong={true} className={styles.logo}>
          {props.title}
        </Typography.Text>
        <Button
          size="small"
          icon={<Icons.DownloadOutlined />}
          onClick={props.onPressSaveContent}
        />
      </Space>
      <Space className={styles.right} wrap>
        {props.renderToolbarExtra?.(props.language)}
        {props.language === UnEditorLanguage.Markdown && (
          <Button
            size="small"
            icon={props.isPreviewing ? <Icons.EyeInvisibleOutlined /> : <Icons.EyeOutlined />}
            onClick={() => props.onPreviewingChange?.(!props.isPreviewing)}
          />
        )}
        <Select
          size="small"
          className={styles.language}
          value={props.language}
          onChange={props.onLanguageChange}
          disabled={props.disbaled || props.isPreviewing || props.disabledLanguageSelect}
          options={UnEditorLanguages.map((lang) => ({
            label: lang.name,
            value: lang.id
          }))}
        />
        <Button
          size="small"
          icon={
            props.isFullscreen ? <Icons.FullscreenExitOutlined /> : <Icons.FullscreenOutlined />
          }
          onClick={() => props.onFullscreenChange(!props.isFullscreen)}
        />
      </Space>
    </Flex>
  )
}
