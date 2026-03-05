/**
 * @file Token service
 * @author Surmon <https://github.com/surmon-china>
 */

import localstorage from './localstorage'
import { TokenResult } from '@/apis/admin'
import { AppLocalStorageKey } from '@/config'

export const setToken = (token: TokenResult): void => {
  const expiresAt = Math.floor(Date.now() / 1000) + token.expires_in
  localstorage.set(AppLocalStorageKey.AccessToken, token.access_token)
  localstorage.set(AppLocalStorageKey.RefreshToken, token.refresh_token)
  localstorage.set(AppLocalStorageKey.TokenExpiresAt, String(expiresAt))
}

export const removeToken = () => {
  localstorage.remove(AppLocalStorageKey.AccessToken)
  localstorage.remove(AppLocalStorageKey.RefreshToken)
  localstorage.remove(AppLocalStorageKey.TokenExpiresAt)
}

export const getAccessToken = () => {
  return localstorage.get(AppLocalStorageKey.AccessToken)
}

export const getRefreshToken = () => {
  return localstorage.get(AppLocalStorageKey.RefreshToken)
}

export const getAccessTokenCountdown = (): number => {
  const expiresAt = Number(localstorage.get(AppLocalStorageKey.TokenExpiresAt) || 0)
  if (!expiresAt) return 0

  const now = Math.floor(Date.now() / 1000)
  return expiresAt > now ? expiresAt - now : 0
}

export const isAccessTokenValid = (): boolean => {
  const token = getAccessToken()
  const isFormatValid = !!token && token.split('.').length === 3
  return isFormatValid && getAccessTokenCountdown() > 0
}

export default {
  setToken,
  removeToken,
  getAccessToken,
  getRefreshToken,
  isAccessTokenValid,
  getAccessTokenCountdown
}
