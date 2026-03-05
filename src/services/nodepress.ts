/**
 * @file NodePress request service
 * @author Surmon <https://github.com/surmon-china>
 */

import axios from 'axios'
import type { AxiosError, AxiosInstance, Method as AxiosMethod } from 'axios'
import { notification } from 'antd'
import { API_URL, APP_AUTH_HEADER_KEY } from '@/config'
import { ADMIN_AUTH_API_PATHS } from '@/apis/admin'
import { RoutesKey, RoutesPath } from '@/routes'
import { i18n } from '@/i18n'
import tokenService from './token'

enum HttpCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  GATEWAY_TIMEOUT = 504
}

export enum ResponseStatus {
  Success = 'success',
  Error = 'error'
}

export interface HttpSuccessResponse<T = any> {
  status: ResponseStatus.Success
  message: string
  result: T
}

export interface HttpErrorResponse {
  status: ResponseStatus.Error
  message: string
  error: string
  timestamp: string
}

export interface RequestParams {
  [key: string]: string | number
}

export const nodepress = axios.create({
  baseURL: API_URL,
  // MARK: WORKAROUND for demo site
  adapter: (window as any).__axiosAdapter || void 0
})

// request interceptor
nodepress.interceptors.request.use((config) => {
  if (tokenService.isAccessTokenValid()) {
    config.headers = config.headers || {}
    config.headers[APP_AUTH_HEADER_KEY] = `Bearer ${tokenService.getAccessToken()}`
  } else if (config.url !== ADMIN_AUTH_API_PATHS.LOGIN) {
    notification.error({
      title: i18n.t('nodepress.request.invalid_token.title'),
      description: i18n.t('nodepress.request.invalid_token.description'),
      duration: 2
    })
  }
  return config
})

// response interceptor
nodepress.interceptors.response.use(
  (response) => {
    if (!response.headers['content-type']?.includes('json')) {
      notification.success({
        title: i18n.t('nodepress.response.success'),
        description: response.statusText,
        duration: 2
      })
      return response
    }

    if (response.data.status === ResponseStatus.Success) {
      notification.success({
        title: i18n.t('nodepress.response.success'),
        description: response.data.message,
        duration: 2
      })
      return response.data
    }

    return Promise.reject(response)
  },
  (error: AxiosError<HttpErrorResponse>) => {
    console.debug('axios error:', error)

    notification.error({
      title: error.response?.data.error ?? error.response?.statusText ?? error.message,
      description: error.response?.data.message ?? '-',
      duration: 3
    })

    // If a 401 response is received, it means that the authentication has failed,
    // the token is deleted and you are redirected to the login page.
    if (error.response?.status === HttpCode.UNAUTHORIZED) {
      tokenService.removeToken()
      window.router.navigate(RoutesPath[RoutesKey.Hello])
    }

    return Promise.reject(error)
  }
)

type Method = Exclude<Lowercase<AxiosMethod>, 'unlink' | 'purge' | 'link'> | 'request'
const overwrite = (method: Method) => {
  return <T = any>(
    ...args: Parameters<AxiosInstance[typeof method]>
  ): Promise<HttpSuccessResponse<T>> => {
    return (nodepress[method] as any)(...args)
  }
}

export default {
  $: nodepress,
  request: overwrite('request'),
  head: overwrite('head'),
  get: overwrite('get'),
  post: overwrite('post'),
  put: overwrite('put'),
  patch: overwrite('patch'),
  delete: overwrite('delete'),
  options: overwrite('options')
}
