/**
 * @file Static
 * @author Surmon <https://github.com/surmon-china>
 */

import _isNumber from 'lodash/isNumber'
import nodepress from '@/services/nodepress'

export const STATIC_API_PATHS = {
  UPLOAD: '/system/static/upload',
  LIST: '/system/static/list'
}

export interface StaticFileObject {
  key: string
  url: string
  eTag: string
  size: number
  lastModified?: number
  storageClass?: string
}

export type StaticFileListResult = Awaited<ReturnType<typeof getStaticFileList>>

/** 获取静态文件列表 */
export async function getStaticFileList(params?: {
  limit?: number
  prefix?: string
  startAfter?: string
  delimiter?: string
}) {
  return nodepress
    .get<{
      name?: string
      limit?: number
      prefix?: string
      marker?: string
      delimiter?: string
      startAfter?: string
      commonPrefixes?: Array<{ Prefix?: string }>
      files: StaticFileObject[]
    }>(STATIC_API_PATHS.LIST, { params })
    .then((response) => response.result)
}

/** 上传静态文件 */
export async function uploadStaticToNodePress(
  file: File,
  key: string,
  onProgress?: (progress: number) => void
) {
  const formData = new FormData()
  // https://github.com/fastify/fastify-multipart
  // MARK: Always keep the file at the end of the FormData to ensure that other field values can be read by the server.
  formData.append('key', key)
  formData.append('file', file)

  return nodepress
    .post<StaticFileObject>(STATIC_API_PATHS.UPLOAD, formData, {
      onUploadProgress: ({ loaded, total }) => {
        if (_isNumber(total)) {
          onProgress?.((loaded / total) * 100)
        }
      }
    })
    .then((response) => response.result)
}
