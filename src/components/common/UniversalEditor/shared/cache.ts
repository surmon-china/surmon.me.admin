import _debounce from 'lodash/debounce'
import localforage from 'localforage'
import { APP_DB_NAME, AppDbStoreName } from '@/config'

const editorStore = localforage.createInstance({
  name: APP_DB_NAME,
  storeName: AppDbStoreName.EditorCache
})

const getEditorCacheStorageKey = (id: string) => `uneditor-${id}`

export const setUnEditorCache = _debounce((id: string, content: string) => {
  editorStore.setItem(getEditorCacheStorageKey(id), content).catch((error) => {
    console.error(`[UnEditor] Failed to save cache for ${id}:`, error)
  })
}, 666)

export const getUnEditorCache = async (id: string): Promise<string | null> => {
  try {
    return await editorStore.getItem<string>(getEditorCacheStorageKey(id))
  } catch (error) {
    console.error(`[UnEditor] Failed to load cache for ${id}:`, error)
    return null
  }
}
