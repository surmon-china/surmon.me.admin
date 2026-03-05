import * as adminApi from '@/apis/admin'
import tokenService from '@/services/token'

let refreshTimer: null | number = null

export const stopTokenAutoRefresh = (): void => {
  if (refreshTimer) {
    window.clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

export const startTokenAutoRefresh = (): void => {
  stopTokenAutoRefresh()

  const countdown = tokenService.getAccessTokenCountdown()
  const waitSeconds = Math.max(1, countdown - 300)

  console.debug(`Token will be auto-refreshed in ${waitSeconds}s`)

  refreshTimer = window.setTimeout(async () => {
    try {
      const refreshToken = tokenService.getRefreshToken()
      if (refreshToken) {
        tokenService.setToken(await adminApi.refreshToken(refreshToken))
        startTokenAutoRefresh()
      }
    } catch (error) {
      console.error('Auto refresh token failed:', error)
    }
  }, waitSeconds * 1000)
}
