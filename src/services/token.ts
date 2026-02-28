/**
 * @file Token service
 * @author Surmon <https://github.com/surmon-china>
 */

import localstorage from './localstorage'
import { AppLocalStorageKey } from '@/config'

export const getToken = () => {
  return localstorage.get(AppLocalStorageKey.IdToken)
}

export const setToken = (token: string, expires_in: number): void => {
  localstorage.set(AppLocalStorageKey.IdToken, token)
  localstorage.set(AppLocalStorageKey.TokenExpiresIn, String(expires_in))
  localstorage.set(AppLocalStorageKey.TokenBirthTime, String(Math.floor(Date.now() / 1000)))
}

export const removeToken = () => {
  localstorage.remove(AppLocalStorageKey.IdToken)
  localstorage.remove(AppLocalStorageKey.TokenExpiresIn)
  localstorage.remove(AppLocalStorageKey.TokenBirthTime)
}

export const getTokenCountdown = (): number => {
  const expiresIn = Number(localstorage.get(AppLocalStorageKey.TokenExpiresIn) || 0)
  const birthTime = Number(localstorage.get(AppLocalStorageKey.TokenBirthTime) || 0)
  if (!expiresIn || !birthTime) return 0

  const deadLine = birthTime + expiresIn
  const now = Math.floor(Date.now() / 1000)
  return deadLine > now ? deadLine - now : 0
}

export const isTokenValid = (): boolean => {
  const token = getToken()
  const isFormatValid = !!token && token.split('.').length === 3
  const isTimeValid = getTokenCountdown() > 0
  return isFormatValid && isTimeValid
}

export default {
  getToken,
  setToken,
  removeToken,
  isTokenValid,
  getTokenCountdown
}
