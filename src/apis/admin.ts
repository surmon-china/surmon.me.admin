/**
 * @file Admin profile
 * @author Surmon <https://github.com/surmon-china>
 */

import { Base64 } from 'js-base64'
import { AdminProfile } from '@/constants/admin'
import nodepress from '@/services/nodepress'

export const ADMIN_PROFILE_API_PATH = '/admin/profile'
export const ADMIN_AUTH_API_PATHS = {
  LOGIN: '/admin/login',
  LOGOUT: '/admin/logout',
  VERIFY_TOKEN: '/admin/verify-token',
  REFRESH_TOKEN: '/admin/refresh-token'
}

// https://github.com/surmon-china/nodepress/blob/main/src/core/auth/auth.interface.ts
export interface TokenResult {
  token_type: 'Bearer'
  access_token: string
  expires_in: number
  refresh_token: string
}

/** 登录 */
export function authLogin(password: string) {
  return nodepress
    .post<TokenResult>(ADMIN_AUTH_API_PATHS.LOGIN, { password: Base64.encode(password) })
    .then((response) => response.result)
}

/** 登出（让 Token 在服务端失效） */
export function authLogout(refresh_token?: string) {
  return nodepress.post<void>(ADMIN_AUTH_API_PATHS.LOGOUT, { refresh_token })
}

/** 续约 Token */
export function refreshToken(refresh_token: string) {
  return nodepress
    .post<TokenResult>(ADMIN_AUTH_API_PATHS.REFRESH_TOKEN, { refresh_token })
    .then((response) => response.result)
}

/** 检查 Token 有效性 */
export function verifyToken() {
  return nodepress.post<void>(ADMIN_AUTH_API_PATHS.VERIFY_TOKEN)
}

/** 获取管理员资料 */
export function getAdminProfile() {
  return nodepress.get<AdminProfile>(ADMIN_PROFILE_API_PATH).then((response) => response.result)
}

/** 更新管理员资料（包括平台密码） */
export function updateAdminProfile(profile: AdminProfile) {
  const payload = {
    ...profile,
    password: profile.password ? Base64.encode(profile.password) : '',
    new_password: profile.new_password ? Base64.encode(profile.new_password) : ''
  }
  return nodepress
    .patch<AdminProfile>(ADMIN_PROFILE_API_PATH, payload)
    .then((response) => response.result)
}
