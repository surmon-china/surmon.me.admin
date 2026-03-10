export type ChatMessageRole = 'user' | 'assistant' | 'system' | 'tool'

export interface ChatMessage {
  id: number
  session_id: string
  author_name: string | null
  author_email: string | null
  user_id: string | null
  role: ChatMessageRole
  content: string | null
  model: string | null
  tool_calls: string | null
  tool_call_id: string | null
  input_tokens: number
  output_tokens: number
  created_at: number
}

export interface ChatSession {
  session_id: string
  last_active: number
  last_user_message: string | null
  message_count: number
  input_tokens: number
  output_tokens: number
  total_tokens: number
  author_name: string | null
  author_email: string | null
  user_id: string | null
}
