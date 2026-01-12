import React from 'react'
import dayjs from 'dayjs'
import { useRef } from 'veact'
import { Button, Form, Select, Input, Modal, Space } from 'antd'
import type { FormInstance } from 'antd'
import * as Icons from '@ant-design/icons'
import { FileManager } from '@/components/common/FileManager'
import { UniversalEditor } from '@/components/common/UniversalEditor'
import { MultipleUploaderModal } from './components/MultipleUploaderModal'
import { BLOG_ARTICLE_URL_PREFIX } from '@/transforms/url'
import { TagSelect } from './components/TagSelect'
import type { MainFormModel } from '.'

export interface MainFormExtraItem {
  label: string
  content: React.ReactNode
}

export interface MainFormProps {
  form: FormInstance<MainFormModel>
  extraItems?: MainFormExtraItem[]
  editorCacheId?: string
}

export const MainForm: React.FC<MainFormProps> = (props) => {
  const isUploaderModalOpen = useRef(false)
  const isFileManagerModalOpen = useRef(false)

  return (
    <>
      <Form
        scrollToFirstError={true}
        colon={false}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        form={props.form}
      >
        {props.extraItems?.map((extra, index) => (
          <Form.Item label={extra.label} wrapperCol={{ span: 24 }} key={index}>
            {extra.content}
          </Form.Item>
        ))}
        <Form.Item
          label="别名"
          name="slug"
          wrapperCol={{ span: 12 }}
          rules={[
            {
              pattern: /^[a-zA-Z0-9-_]+$/,
              message: '仅支持 英文、数字、_、-'
            }
          ]}
        >
          <Input placeholder="article-slug" prefix={BLOG_ARTICLE_URL_PREFIX} allowClear={true} />
        </Form.Item>
        <Form.Item
          label="标题"
          name="title"
          wrapperCol={{ span: 12 }}
          rules={[
            {
              required: true,
              message: '请输入标题'
            }
          ]}
        >
          <Input placeholder="文章标题" />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          required={true}
          rules={[
            {
              required: true,
              message: '请输入标题'
            }
          ]}
        >
          <Input.TextArea rows={4} placeholder="文章描述" />
        </Form.Item>
        <Form.Item label="关键词" name="keywords">
          <Select placeholder="输入关键词后回车" mode="tags" />
        </Form.Item>
        <Form.Item label="标签" name="tags">
          <TagSelect />
        </Form.Item>
        <br />
        <Form.Item
          label="内容"
          name="content"
          required={true}
          rules={[
            {
              required: true,
              message: '请输入文章内容'
            }
          ]}
        >
          <UniversalEditor
            eid={props.editorCacheId}
            placeholder="输入文章内容..."
            rows={38}
            formStatus={true}
            autoFocus={true}
            renderToolbarExtra={() => (
              <>
                <Button
                  size="small"
                  icon={<Icons.CloudDownloadOutlined />}
                  onClick={() => {
                    isFileManagerModalOpen.value = true
                  }}
                />
                <Button
                  size="small"
                  icon={<Icons.CloudUploadOutlined />}
                  onClick={() => {
                    isUploaderModalOpen.value = true
                  }}
                />
              </>
            )}
          />
        </Form.Item>
      </Form>
      <MultipleUploaderModal
        open={isUploaderModalOpen.value}
        onClose={() => (isUploaderModalOpen.value = false)}
        uploaderDirectory={`nodepress/${dayjs().format('YYYY-MM-DD')}`}
      />
      <Modal
        title="云存储文件管理"
        centered={true}
        closable={true}
        width={880}
        footer={null}
        open={isFileManagerModalOpen.value}
        onCancel={() => (isFileManagerModalOpen.value = false)}
        styles={{
          body: {
            paddingTop: '12px',
            paddingRight: '14px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }
        }}
      >
        <FileManager initPrefix="nodepress/" tableListSize="small" />
      </Modal>
    </>
  )
}
