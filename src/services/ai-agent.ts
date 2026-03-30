/**
 * @file Ai agent request service
 * @author Surmon <https://github.com/surmon-china>
 */

import axios from 'axios'
import type { AxiosError } from 'axios'
import { notification } from 'antd'
import { AI_AGENT_API_URL, APP_AUTH_HEADER_KEY } from '@/config'
import { ADMIN_AUTH_API_PATHS } from '@/apis/admin'
import { RoutesKey, getRoutePath } from '@/routes'
import { i18n } from '@/i18n'
import { HttpCode } from './nodepress'
import tokenService from './token'

export interface RequestParams {
  [key: string]: string | number
}

export const aiAgent = axios.create({
  baseURL: AI_AGENT_API_URL + '/admin'
})

// request interceptor
aiAgent.interceptors.request.use((config) => {
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
aiAgent.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    console.debug('axios error:', error)

    notification.error({
      title: error.response?.data.message ?? error.response?.statusText ?? error.message,
      description: error.response?.data.error ?? '-',
      duration: 3
    })

    // If a 401 response is received, it means that the authentication has failed,
    // the token is deleted and you are redirected to the login page.
    if (error.response?.status === HttpCode.UNAUTHORIZED) {
      tokenService.removeToken()
      window.router.navigate(getRoutePath(RoutesKey.Hello))
    }

    return Promise.reject(error)
  }
)

export default aiAgent
