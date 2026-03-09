/**
 * @file AI Agent
 * @author Surmon <https://github.com/surmon-china>
 */

import { ChatMessage, ChatSession } from '@/constants/ai-agent'
import aiAgent from '@/services/ai-agent'

/** 获取对话参数 */
export interface GetSessionsParams {
  author_name?: string
  author_email?: string
  user_id?: string
  page?: number
  page_size?: number
  sort_field?: 'last_active' | 'message_count' | 'total_tokens'
  sort_order?: 'asc' | 'desc'
}

/** 获取对话列表 */
export function getChatSessions(params: GetSessionsParams = {}) {
  return aiAgent
    .get<ChatSession[]>('/chat-sessions', { params })
    .then((response) => response.data)
}

/** 获取对话详情 */
export function getChatMessages(sessionId: string) {
  return aiAgent
    .get<ChatMessage[]>(`/chat-sessions/${sessionId}`)
    .then((response) => response.data)
}
