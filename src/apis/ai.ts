/**
 * @file AI API
 * @author Surmon <https://github.com/surmon-china>
 */

import nodepress from '@/services/nodepress'

export const AI_API_PATH = '/ai'

export interface AiModel {
  id: string
  model: string
  provider: string
}

export interface AiConfig {
  models: AiModel[]
  prompts: Record<'article_summary' | 'article_review' | 'comment_reply', string>
  extra_keys: {
    article_summary: Record<'Content' | 'Model' | 'Provider' | 'Timestamp', string>
    article_review: Record<'Content' | 'Model' | 'Provider' | 'Timestamp' | 'Link', string>
    comment_generation: any
  }
}

export interface AiGenerateResult {
  content: string
  provider: string
  model: string
}

/** AI 生成请求的基础参数 */
export interface GenerateAiContentParams {
  prompt?: string
  model?: string
  temperature?: number
}

export interface GenerateAiArticleContentParams extends GenerateAiContentParams {
  article_id: number
}

/** 获取 AI 全局配置 */
export function getAiConfig() {
  return nodepress.get<AiConfig>(`${AI_API_PATH}/config`).then((response) => response.result)
}

/** 生成文章摘要 */
export function generateArticleSummary(config: GenerateAiArticleContentParams) {
  return nodepress
    .post<AiGenerateResult>(`${AI_API_PATH}/generate-article-summary`, config)
    .then((response) => response.result)
}

/** 生成文章点评 */
export function generateArticleReview(config: GenerateAiArticleContentParams) {
  return nodepress
    .post<AiGenerateResult>(`${AI_API_PATH}/generate-article-review`, config)
    .then((response) => response.result)
}
