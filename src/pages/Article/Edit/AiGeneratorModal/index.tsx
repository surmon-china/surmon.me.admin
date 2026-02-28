import React from 'react'
import { useShallowRef, useWatch, onMounted } from 'veact'
import { useLoading } from 'veact-use'
import { Modal, Row, Col, message } from 'antd'
import * as aiApi from '@/apis/ai'
import { AiConfig, GenerateAiArticleContentParams, AiGenerateResult } from '@/apis/ai'
import { AiGeneratorPanel, GeneratorForm } from './GeneratorPanel'
import { AiResultPagination } from './ResultPagination'
import { AiResultPanel } from './ResultPanel'
import { useAiHistory } from './history'

export interface AiGeneratorModalProps {
  title: string
  open: boolean
  articleId: number
  onApply?(extras: Record<string, string>): void
  onCancel?(): void
  generator: {
    type: 'article_summary' | 'article_review'
    generate(payload: GenerateAiArticleContentParams): Promise<AiGenerateResult>
  }
}

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = (props) => {
  const historyId = `${props.generator.type}_${props.articleId}`
  const { history, isReady, appendHistory, clearHistory } = useAiHistory(historyId)
  const aiConfig = useShallowRef<AiConfig | null>(null)
  const currentIndex = useShallowRef(0)
  const generating = useLoading()

  useWatch(
    () => isReady.value,
    (ready) => {
      if (ready && history.value.length > 0) {
        currentIndex.value = history.value.length - 1
      }
    }
  )

  onMounted(async () => {
    try {
      aiConfig.value = await aiApi.getAiConfig()
    } catch {
      message.error('获取 AI 配置失败')
    }
  })

  const handleChangeIndex = (index: number) => {
    currentIndex.value = index
  }

  const handleClearHistory = () => {
    clearHistory()
    currentIndex.value = 0
  }

  const handleGenerate = async (formValues: GeneratorForm) => {
    const payload: GenerateAiArticleContentParams = {
      article_id: props.articleId,
      model: formValues.model || undefined,
      prompt: formValues.prompt?.trim() || undefined,
      temperature: formValues.temperature || undefined
    }

    try {
      const response = await generating.promise(props.generator.generate(payload))
      appendHistory(response)
      currentIndex.value = history.value.length - 1
      message.success('生成成功')
    } catch {
      message.error('生成失败')
    }
  }

  const applyCurrentRecord = () => {
    const config = aiConfig.value
    const record = history.value[currentIndex.value]
    if (config && record) {
      const keys = config.extra_keys[props.generator.type]
      props.onApply?.({
        [keys.Model]: record.model,
        [keys.Provider]: record.provider,
        [keys.Content]: record.content,
        [keys.Timestamp]: String(Math.floor(record.created_at / 1000)) // seconds
      })
    }
  }

  return (
    <Modal
      title={props.title}
      open={props.open}
      onCancel={props.onCancel}
      centered={true}
      footer={null}
      destroyOnHidden
      width={860}
      styles={{
        body: {
          paddingTop: '1rem',
          maxHeight: '42rem',
          overflow: 'hidden'
        }
      }}
    >
      <Row gutter={24}>
        <Col span={10}>
          <AiGeneratorPanel
            articleId={props.articleId}
            aiConfig={aiConfig.value}
            generatorType={props.generator.type}
            generating={generating.state.value}
            onGenerate={handleGenerate}
          />
        </Col>
        <Col span={14}>
          <AiResultPanel
            generating={generating.state.value}
            record={history.value.length > 0 ? history.value[currentIndex.value] : null}
            onApply={applyCurrentRecord}
            extra={
              generating.state.value ? null : (
                <AiResultPagination
                  total={history.value.length}
                  currentIndex={currentIndex.value}
                  onChangeIndex={handleChangeIndex}
                  onClear={handleClearHistory}
                />
              )
            }
          />
        </Col>
      </Row>
    </Modal>
  )
}
