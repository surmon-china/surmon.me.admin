import localforage from 'localforage'
import { useShallowRef, onMounted, useWatch } from 'veact'
import { APP_DB_NAME, AppDbStoreName } from '@/config'
import { AiGenerateResult } from '@/apis/ai'

const aiHistoryStore = localforage.createInstance({
  name: APP_DB_NAME,
  storeName: AppDbStoreName.AiHistory
})

export interface AiHistoryRecord extends AiGenerateResult {
  id: string
  created_at: number
}

export const useAiHistory = (historyId: string) => {
  const history = useShallowRef<AiHistoryRecord[]>([])
  const isReady = useShallowRef(false)

  onMounted(async () => {
    try {
      const cached = await aiHistoryStore.getItem<AiHistoryRecord[]>(historyId)
      if (cached && Array.isArray(cached)) {
        history.value = cached
      }
    } catch (e) {
      console.error('Failed to load AI history from IndexedDB:', e)
      history.value = []
    } finally {
      isReady.value = true
    }
  })

  useWatch(
    () => history.value,
    (newVal) => {
      if (isReady.value) {
        aiHistoryStore.setItem(historyId, newVal)
      }
    }
  )

  const appendHistory = (result: AiGenerateResult) => {
    const newRecord: AiHistoryRecord = {
      ...result,
      id: Math.random().toString(36).substring(2, 9),
      created_at: Date.now()
    }
    history.value = [...history.value, newRecord]
  }

  const clearHistory = () => {
    history.value = []
  }

  return { history, isReady, appendHistory, clearHistory }
}
