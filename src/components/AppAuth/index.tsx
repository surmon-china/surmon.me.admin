/**
 * @desc App auth interceptor component
 * @author Surmon <https://github.com/surmon-china>
 */

import React, { useState } from 'react'
import { onMounted, onBeforeUnmount } from 'veact'
import { useNavigate } from 'react-router'
import { notification, Typography, Spin, Space, Flex } from 'antd'
import { Loading3QuartersOutlined } from '@ant-design/icons'
import { useTranslation } from '@/i18n'
import { RoutesKey, getRoutePath } from '@/routes'
import * as adminApi from '@/apis/admin'
import tokenService from '@/services/token'
import { startTokenAutoRefresh, stopTokenAutoRefresh } from './token'

import styles from './style.module.less'

const LOADING_ANIMATED_DELAY = 600
const LOADING_ANIMATED_DURATION = 200
const LOADING_ANIMATED_STYLE: React.CSSProperties = {
  transitionProperty: 'all',
  transitionDuration: `${LOADING_ANIMATED_DURATION}ms`,
  transitionDelay: `${LOADING_ANIMATED_DELAY - LOADING_ANIMATED_DURATION}ms`,
  backgroundColor: 'transparent',
  opacity: 0
}

export const AppAuth: React.FC<React.PropsWithChildren> = (props) => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()

  const [verifying, setVerifying] = useState(false)
  const [isLogined, setLogined] = useState(false)
  const [isAnimationEnded, setAnimationEnded] = useState(false)

  const autoLoginByToken = async () => {
    try {
      // When the application is initialised, it first checks the local Token.
      setVerifying(true)
      console.debug('Token verifying...')

      if (tokenService.isAccessTokenValid()) {
        // 1. Verify local Token
        await adminApi.verifyToken()
      } else {
        // 2. Try refresh token
        console.debug('Access token invalid, attempting refresh...')
        const refreshToken = tokenService.getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token available')

        tokenService.setToken(await adminApi.refreshToken(refreshToken))
        console.debug('Access token restored via refresh token.')
      }

      // Verification successful
      console.debug('Token verification successful.')
      setVerifying(false)
      // 3. Start auto-refresh of Token
      startTokenAutoRefresh()
      // A delay is needed to make sure the effect is smooth.
      setLogined(true)
      setTimeout(() => setAnimationEnded(true), LOADING_ANIMATED_DELAY)
    } catch (error) {
      console.debug('Invalid token, need to log in again.', error)
      notification.info({
        title: i18n.t('login.invalid_token_message_title'),
        description: i18n.t('login.invalid_token_message_description')
      })
      tokenService.removeToken()
      navigate(getRoutePath(RoutesKey.Hello))
    }
  }

  onMounted(() => autoLoginByToken())
  onBeforeUnmount(() => stopTokenAutoRefresh())

  return (
    <div id="app-auth">
      {isLogined && props.children}
      {!isAnimationEnded && (
        <Flex
          align="center"
          justify="center"
          className={styles.appLoading}
          style={isLogined ? LOADING_ANIMATED_STYLE : {}}
        >
          <Space orientation="vertical" align="center">
            <Spin indicator={<Loading3QuartersOutlined spin style={{ fontSize: 48 }} />} />
            <Typography.Text type="secondary">
              {verifying ? i18n.t('login.verifying_token') : i18n.t('login.initializing')}
            </Typography.Text>
          </Space>
        </Flex>
      )}
    </div>
  )
}
